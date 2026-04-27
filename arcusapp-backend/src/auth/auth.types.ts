import type { User } from '../supabase/schema';

export type SafeUser = Omit<User, 'passwordHash'>;

export type AuthenticatedUser = {
  id: string;
  email: string;
  username: string;
};
