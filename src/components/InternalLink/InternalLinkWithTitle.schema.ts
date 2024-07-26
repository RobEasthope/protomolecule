import { RiLinksLine } from "react-icons/ri";
import { defineField, defineType } from "sanity";

import { LINKABLE_DOC_TYPES } from "./LINKABLE_DOC_TYPES";

export default defineType({
  name: "InternalLinkWithTitle",
  title: "Internal link",
  type: "object",
  description: "Link to a document on the site",
  icon: RiLinksLine,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",

      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "internalUID",
      title: "Page",
      type: "reference",
      to: LINKABLE_DOC_TYPES,

      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: { title: string }) {
      return {
        title: title || "Internal link",
        subtitle: title && "Internal link",
      };
    },
  },
});
