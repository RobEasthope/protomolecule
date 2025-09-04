import { RiExternalLinkLine } from "react-icons/ri";
import { defineField, defineType } from "sanity";

export default defineType({
  description: "Add a link to outside the site",
  fields: [
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
  name: "ExternalLink",
  preview: {
    prepare() {
      return {
        title: "External link",
      };
    },
  },
  title: "External link",
  type: "object",
});
