import { RiExternalLinkLine } from "react-icons/ri";
import { defineField, defineType } from "sanity";

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
          scheme: ["https", "http"],
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: { title: string }) {
      return {
        title: title || "External link",
        subtitle: title && "External link",
      };
    },
  },
});
