// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  clientId: "dc02a629-1cb6-451d-bbb1-44a9b3279be1",
  token: "d9a98dc5fb79e9517d37abe0eb62c306a3c6b672",
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
            type: "object",
            list: true,
            name: "photos",
            label: "Photos",
            ui: {
              itemProps: (item) => ({ label: item?.caption || "New Photo" })
            },
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
            type: "object",
            list: true,
            name: "clippings",
            label: "Press Clippings",
            ui: {
              itemProps: (item) => ({ label: item?.title || "New Press Mention" })
            },
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
    ]
  }
});
export {
  config_default as default
};
