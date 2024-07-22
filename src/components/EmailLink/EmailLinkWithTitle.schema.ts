import { MdOutlineEmail } from "react-icons/md";
import { defineField, defineType } from "sanity";

import type { TitleAndSubTitleListPreviewProps } from "~/types/listPreviews";

export default defineType({
  name: "EmailLinkWithTitle",
  title: "Email link",
  type: "object",
  description: "Adds an email link",
  icon: MdOutlineEmail,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email address",
      type: "string",
      validation: (Rule) =>
        Rule.custom((email) => {
          if (typeof email === "undefined") {
            return true; // Allow undefined values
          }

          return email
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            )
            ? true
            : "This is not an email";
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "email",
    },
    prepare({ title, subtitle }: TitleAndSubTitleListPreviewProps) {
      return {
        title: title || "Email link",
        subtitle: subtitle || "",
      };
    },
  },
});
