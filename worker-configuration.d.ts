declare module 'worker-configuration' {
  export interface WorkerConfig {
    // Додай типи, якщо знаєш (наприклад, для D1Database)
  }
}

declare global {
  interface Env {
    // додай тут свої binding'и, наприклад:
    DB: D1Database;
    // ANOTHER_BINDING?: DurableObjectNamespace;
  }
}

// щоб файл був модулем і не впливав на інші файли
export {};