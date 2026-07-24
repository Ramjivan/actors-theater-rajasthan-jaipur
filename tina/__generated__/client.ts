import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ cacheDir: 'D:/projects/actors-theater-rajasthan-jaipur/tina/__generated__/.cache/1784875898963', url: '/api/tina/gql', token: 'dummy-token', queries,  });
export default client;
  