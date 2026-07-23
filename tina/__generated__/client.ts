import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ cacheDir: 'D:/projects/actors-theater-rajasthan-jaipur/tina/__generated__/.cache/1784821546260', url: 'http://localhost:4001/graphql', token: 'undefined', queries,  });
export default client;
  