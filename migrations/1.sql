
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  trial_started_at DATETIME,
  trial_expires_at DATETIME,
  subscription_status TEXT DEFAULT 'trial',
  subscription_id TEXT,
  lemonsqueezy_customer_id TEXT,
  lemonsqueezy_subscription_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  session_data TEXT,
  last_activity_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
