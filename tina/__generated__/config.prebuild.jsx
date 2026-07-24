// tina/config.ts
import { defineConfig } from "tinacms";
import { UsernamePasswordAuthJSProvider } from "tinacms-authjs/dist/tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
var config_default = defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || "dummy-client-id",
  token: process.env.TINA_TOKEN || "dummy-token",
  // Setup the custom AuthJS provider
  authProvider: isLocal ? void 0 : new UsernamePasswordAuthJSProvider(),
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "gallery",
        label: "Gallery Photos",
        path: "content/gallery",
        format: "json",
        fields: [
          {
            type: "image",
            name: "image",
            label: "Image",
            required: true
          },
          {
            type: "string",
            name: "caption",
            label: "Caption"
          }
        ]
      },
      {
        name: "press",
        label: "Press & Media",
        path: "content/press",
        format: "json",
        fields: [
          {
            type: "image",
            name: "image",
            label: "Press Image",
            required: true
          },
          {
            type: "string",
            name: "title",
            label: "Title"
          },
          {
            type: "datetime",
            name: "date",
            label: "Date"
          },
          {
            type: "string",
            name: "link",
            label: "External Link"
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
