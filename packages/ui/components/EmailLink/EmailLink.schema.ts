import { MdOutlineEmail } from "react-icons/md";
import { defineField, defineType } from "sanity";

export default defineType({
  description: "Adds an email link",
  fields: [
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
  name: "EmailLink",
  preview: {
    prepare() {
      return {
        title: "Email link",
      };
    },
  },
  title: "Email link",
  type: "object",
});
