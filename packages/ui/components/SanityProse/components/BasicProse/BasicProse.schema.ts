import { defineArrayMember, defineType } from "sanity";

export default defineType({
  name: "BasicProse",
  of: [
    defineArrayMember({
      marks: {
        annotations: [
          { type: "InternalLink" },
          { type: "ExternalLink" },
          { type: "EmailLink" },
        ],
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
      },
      styles: [],
      type: "block",
    }),
  ],
  title: "Basic prose",
  type: "array",
});
