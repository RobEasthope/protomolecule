import { defineArrayMember, defineType } from "sanity";

export default defineType({
  name: "FullProse",
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
          { title: "Code", value: "code" },
        ],
      },
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Large heading", value: "h2" },
        { title: "Medium heading", value: "h3" },
        { title: "Small heading", value: "h4" },
      ],
      type: "block",
    }),
  ],
  title: "Full prose",
  type: "array",
});
