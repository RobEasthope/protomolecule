import { MdOutlineEmail } from "react-icons/md";
import { defineField, defineType } from "sanity";

export default defineType({
  description: "Adds an email link",
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

          return /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u.test(
            email.toLowerCase()
          )
            ? true
            : "This is not an email";
        }),
    }),
  ],
  icon: MdOutlineEmail,
  name: "EmailLinkWithTitle",
  preview: {
    prepare({ subtitle, title }: { subtitle: string; title: string }) {
      return {
        subtitle: subtitle || "",
        title: title || "Email link",
      };
    },
    select: {
      subtitle: "email",
      title: "title",
    },
  },
  title: "Email link",
  type: "object",
});
