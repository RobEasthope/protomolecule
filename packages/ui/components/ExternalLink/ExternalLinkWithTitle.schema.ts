import { RiExternalLinkLine } from "react-icons/ri";
import { defineField, defineType } from "sanity";

export default defineType({
  description: "Add a link to outside the site",
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
          scheme: ["https", "http"],
        }),
    }),
  ],
  icon: RiExternalLinkLine,
  name: "ExternalLinkWithTitle",
  preview: {
    prepare({ title }: { title: string }) {
      return {
        subtitle: title && "External link",
        title: title || "External link",
      };
    },
    select: {
      title: "title",
    },
  },
  title: "External link",
  type: "object",
});
