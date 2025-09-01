"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var md_1 = require("react-icons/md");
var sanity_1 = require("sanity");
exports.default = (0, sanity_1.defineType)({
    name: "EmailLinkWithTitle",
    title: "Email link",
    type: "object",
    description: "Adds an email link",
    icon: md_1.MdOutlineEmail,
    fields: [
        (0, sanity_1.defineField)({
            name: "title",
            title: "Title",
            type: "string",
            validation: function (Rule) { return Rule.required(); },
        }),
        (0, sanity_1.defineField)({
            name: "email",
            title: "Email address",
            type: "string",
            validation: function (Rule) {
                return Rule.custom(function (email) {
                    if (typeof email === "undefined") {
                        return true; // Allow undefined values
                    }
                    return email
                        .toLowerCase()
                        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                        ? true
                        : "This is not an email";
                });
            },
        }),
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "email",
        },
        prepare: function (_a) {
            var title = _a.title, subtitle = _a.subtitle;
            return {
                title: title || "Email link",
                subtitle: subtitle || "",
            };
        },
    },
});
