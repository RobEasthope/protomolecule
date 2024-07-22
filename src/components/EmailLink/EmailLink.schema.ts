import { MdOutlineEmail } from "react-icons/md";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "EmailLink",
  title: "Email link",
  type: "object",
  description: "Adds an email link",
  icon: MdOutlineEmail,
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
    prepare() {
      return {
        title: "Email link",
      };
    },
  },
});
