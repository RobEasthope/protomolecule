import { LINKABLE_DOC_TYPES } from "./LINKABLE_DOC_TYPES";
import { RiLinksLine } from "react-icons/ri";
import { defineField, defineType } from "sanity";

export default defineType({
  description: "Link to a page on the site",
  fields: [
    defineField({
      name: "internalUID",
      title: "Page",
      to: LINKABLE_DOC_TYPES,
      type: "reference",

      validation: (Rule) => Rule.required(),
    }),
  ],
  icon: RiLinksLine,
  name: "InternalLink",
  preview: {
    prepare() {
      return {
        subtitle: "Internal link",
      };
    },
  },
  title: "Internal link",
  type: "object",
});
