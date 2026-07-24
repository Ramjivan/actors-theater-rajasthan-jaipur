import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import { Redis } from '@upstash/redis';
import { RedisLevel } from 'upstash-redis-level';
import { GitHubProvider } from 'tinacms-gitprovider-github';
import { createDatabase } from '@tinacms/datalayer';

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

const handler = TinaNodeBackend({
  authProvider: LocalBackendAuthProvider(), // Authentication is handled by Astro Middleware
  databaseClient,
});

export const ALL = async (context: any) => {
  return handler(context.request, context.response);
};
