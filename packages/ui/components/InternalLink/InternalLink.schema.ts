import { RiLinksLine } from "react-icons/ri";
import { defineField, defineType } from "sanity";

import { LINKABLE_DOC_TYPES } from "./LINKABLE_DOC_TYPES";

export default defineType({
  name: "InternalLink",
  title: "Internal link",
  type: "object",
  description: "Link to a page on the site",
  icon: RiLinksLine,
  fields: [
    defineField({
      name: "internalUID",
      title: "Page",
      type: "reference",
      to: LINKABLE_DOC_TYPES,

      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        subtitle: "Internal link",
      };
    },
  },
});
