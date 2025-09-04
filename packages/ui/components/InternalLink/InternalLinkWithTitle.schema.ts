import { LINKABLE_DOC_TYPES } from "./LINKABLE_DOC_TYPES";
import { RiLinksLine } from "react-icons/ri";
import { defineField, defineType } from "sanity";

export default defineType({
  description: "Link to a document on the site",
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
      to: LINKABLE_DOC_TYPES,
      type: "reference",

      validation: (Rule) => Rule.required(),
    }),
  ],
  icon: RiLinksLine,
  name: "InternalLinkWithTitle",
  preview: {
    prepare({ title }: { title: string }) {
      return {
        subtitle: title && "Internal link",
        title: title || "Internal link",
      };
    },
    select: {
      title: "title",
    },
  },
  title: "Internal link",
  type: "object",
});
