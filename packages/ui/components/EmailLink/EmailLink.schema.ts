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

          return /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}\])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/.test(
            email.toLowerCase(),
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
