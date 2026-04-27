type EnvVars = {
  PORT?: string;
  DATABASE_URL?: string;
  FRONTEND_URL?: string;
  JWT_SECRET?: string;
};

export function validateEnv(config: Record<string, unknown>): EnvVars {
  const env = config as EnvVars;

  if (env.DATABASE_URL && !/^postgres(ql)?:\/\//.test(env.DATABASE_URL)) {
    throw new Error(
      'DATABASE_URL must start with postgres:// or postgresql://',
    );
  }

  if (env.FRONTEND_URL) {
    try {
      new URL(env.FRONTEND_URL);
    } catch {
      throw new Error('FRONTEND_URL must be a valid URL');
    }
  }

  return env;
}
