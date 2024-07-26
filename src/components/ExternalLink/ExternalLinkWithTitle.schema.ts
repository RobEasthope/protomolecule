import { RiExternalLinkLine } from "react-icons/ri";
import { defineField, defineType } from "sanity";

import type { TitleListPreviewProps } from "~/types/listPreviews";

export default defineType({
  name: "ExternalLinkWithTitle",
  title: "External link",
  type: "object",
  description: "Add a link to outside the site",
  icon: RiExternalLinkLine,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ["https", "http", "mailto", "tel"],
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: TitleListPreviewProps) {
      return {
        title: title || "External link",
        subtitle: title && "External link",
      };
    },
  },
});
