import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';
import CredentialsProvider from "next-auth/providers/credentials";
import { Redis } from '@upstash/redis';
import { RedisLevel } from 'upstash-redis-level';
import { GitHubProvider } from 'tinacms-gitprovider-github';
import { createDatabase } from '@tinacms/datalayer';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || 'http://localhost',
  token: process.env.KV_REST_API_TOKEN || 'token',
});

const databaseAdapter = new RedisLevel({
  redis: redis,
  namespace: 'tina-atr', 
});

const databaseClient = createDatabase({
  databaseAdapter,
  gitProvider: new GitHubProvider({
    branch: process.env.GITHUB_BRANCH || "main",
    owner: process.env.GITHUB_OWNER || "your-github-username",
    repo: process.env.GITHUB_REPO_NAME || "actors-theater-rajasthan-jaipur",
    token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN || "ghp_mock",
  }),
});

const authOptions = TinaAuthJSOptions({
  databaseClient,
  secret: process.env.NEXTAUTH_SECRET || "default_secret",
});

// Override the default Credentials provider to use ENV vars instead of a database users collection
authOptions.providers = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      username: { label: "Email", type: "text" },
      password: {  label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (
        credentials?.username === process.env.TINA_ADMIN_EMAIL &&
        credentials?.password === process.env.TINA_ADMIN_PASSWORD
      ) {
        return { id: "1", name: "Admin", email: credentials.username };
      }
      return null;
    }
  })
];

const handler = TinaNodeBackend({
  authProvider: isLocal 
    ? LocalBackendAuthProvider() 
    : AuthJsBackendAuthProvider({
        authOptions,
      }),
  databaseClient,
});

export const ALL = async (context: any) => {
  return handler(context.request, context.response);
};
