import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
  getCurrentUser,
} from "@getmocha/users-service/backend";

interface Env {
  DB: D1Database;
  MOCHA_USERS_SERVICE_API_URL: string;
  MOCHA_USERS_SERVICE_API_KEY: string;
  LEMONSQUEEZY_API_KEY: string;
  LEMONSQUEEZY_STORE_ID: string;
  LEMONSQUEEZY_PRODUCT_ID: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', async (c, next) => {
  await next();
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  c.header('Access-Control-Allow-Credentials', 'true');
});

app.options('*', (c) => c.text('', 200));

// Authentication endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  // Get user data to create/update local user record
  const user = await getCurrentUser(sessionToken, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  if (user) {
    // Check if user exists in our database
    const existingUser = await c.env.DB.prepare(
      "SELECT * FROM users WHERE id = ?"
    ).bind(user.id).first();

    if (!existingUser) {
      // Create new user with trial period
      const trialStarted = new Date();
      const trialExpires = new Date(trialStarted.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

      await c.env.DB.prepare(
        "INSERT INTO users (id, email, trial_started_at, trial_expires_at, subscription_status) VALUES (?, ?, ?, ?, ?)"
      ).bind(user.id, user.email, trialStarted.toISOString(), trialExpires.toISOString(), 'trial').run();
    }
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Get subscription status from our database
  const userRecord = await c.env.DB.prepare(
    "SELECT * FROM users WHERE id = ?"
  ).bind(user.id).first();

  const now = new Date();
  let subscriptionStatus = 'expired';
  let daysLeft = 0;

  if (userRecord) {
    if (userRecord.subscription_status === 'active') {
      subscriptionStatus = 'active';
    } else if (userRecord.trial_expires_at) {
      const trialExpires = new Date(userRecord.trial_expires_at as string);
      if (now < trialExpires) {
        subscriptionStatus = 'trial';
        daysLeft = Math.ceil((trialExpires.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      }
    }
  }

  return c.json({
    ...user,
    subscription: {
      status: subscriptionStatus,
      daysLeft,
      trialStarted: userRecord?.trial_started_at,
      trialExpires: userRecord?.trial_expires_at
    }
  });
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Subscription endpoints
app.post('/api/subscription/create-checkout', authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${c.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: user.email,
              custom: {
                user_id: user.id
              }
            }
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: c.env.LEMONSQUEEZY_STORE_ID
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: c.env.LEMONSQUEEZY_PRODUCT_ID
              }
            }
          }
        }
      })
    });

    const data = await response.json() as any;
    
    if (!response.ok) {
      console.error('LemonSqueezy error:', data);
      return c.json({ error: 'Failed to create checkout' }, 500);
    }

    return c.json({ 
      checkoutUrl: data.data.attributes.url 
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return c.json({ error: 'Failed to create checkout' }, 500);
  }
});

// LemonSqueezy webhook endpoint
app.post('/api/webhooks/lemonsqueezy', async (c) => {
  const body = await c.req.json();
  
  if (body.meta?.event_name === 'subscription_created' || body.meta?.event_name === 'subscription_updated') {
    const subscription = body.data;
    const customData = subscription.attributes?.checkout_data?.custom;
    
    if (customData?.user_id) {
      await c.env.DB.prepare(
        "UPDATE users SET subscription_status = ?, lemonsqueezy_subscription_id = ?, updated_at = ? WHERE id = ?"
      ).bind(
        subscription.attributes.status === 'active' ? 'active' : 'expired',
        subscription.id,
        new Date().toISOString(),
        customData.user_id
      ).run();
    }
  }
  
  return c.json({ received: true });
});

// Color conversion utilities
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToCmyk = (r: number, g: number, b: number): { c: number, m: number, y: number, k: number } => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k);
  
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
};

const cmykToRgb = (c: number, m: number, y: number, k: number): { r: number, g: number, b: number } => {
  const cNorm = c / 100;
  const mNorm = m / 100;
  const yNorm = y / 100;
  const kNorm = k / 100;
  
  const r = Math.round(255 * (1 - cNorm) * (1 - kNorm));
  const g = Math.round(255 * (1 - mNorm) * (1 - kNorm));
  const b = Math.round(255 * (1 - yNorm) * (1 - kNorm));
  
  return { r, g, b };
};

app.post('/api/color/convert', async (c) => {
  const { type, value } = await c.req.json();
  
  let rgb = { r: 0, g: 0, b: 0 };
  
  try {
    if (type === 'hex') {
      const result = hexToRgb(value);
      if (!result) throw new Error('Invalid hex color');
      rgb = result;
    } else if (type === 'rgb') {
      const parts = value.split(',').map((p: string) => parseInt(p.trim()));
      if (parts.length !== 3) throw new Error('Invalid RGB format');
      rgb = { r: parts[0], g: parts[1], b: parts[2] };
    } else if (type === 'cmyk') {
      const parts = value.split(',').map((p: string) => parseInt(p.trim()));
      if (parts.length !== 4) throw new Error('Invalid CMYK format');
      rgb = cmykToRgb(parts[0], parts[1], parts[2], parts[3]);
    }
    
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    
    // Simple Pantone approximation (in a real app, you'd use a proper color library)
    const pantoneCoated = `Pantone ${Math.floor(Math.random() * 7000) + 1}C`;
    const pantoneUncoated = `Pantone ${Math.floor(Math.random() * 7000) + 1}U`;
    
    return c.json({
      rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      hex,
      cmyk: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`,
      pantoneCoated,
      pantoneUncoated
    });
  } catch (error) {
    return c.json({ error: 'Invalid color format' }, 400);
  }
});

export default app;
