import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import databaseClient from '../../../../tina/__generated__/databaseClient';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const handler = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient: databaseClient,
          secret: process.env.NEXTAUTH_SECRET || 'super-secret-tina-cms',
          providers: [
            CredentialsProvider({
              name: 'Credentials',
              credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
              },
              async authorize(credentials) {
                if (
                  credentials?.username === process.env.ADMIN_USERNAME &&
                  credentials?.password === process.env.ADMIN_PASSWORD
                ) {
                  return { id: '1', name: 'Admin User', email: 'admin@domain.com' };
                }
                return null;
              },
            }),
          ],
        }),
      }),
  databaseClient,
});

export const ALL = handler;
