"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ri_1 = require("react-icons/ri");
var sanity_1 = require("sanity");
exports.default = (0, sanity_1.defineType)({
    name: "ExternalLinkWithTitle",
    title: "External link",
    type: "object",
    description: "Add a link to outside the site",
    icon: ri_1.RiExternalLinkLine,
    fields: [
        (0, sanity_1.defineField)({
            name: "title",
            title: "Title",
            type: "string",
            validation: function (Rule) { return Rule.required(); },
        }),
        (0, sanity_1.defineField)({
            name: "url",
            title: "URL",
            type: "url",
            validation: function (Rule) {
                return Rule.uri({
                    allowRelative: true,
                    scheme: ["https", "http"],
                });
            },
        }),
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare: function (_a) {
            var title = _a.title;
            return {
                title: title || "External link",
                subtitle: title && "External link",
            };
        },
    },
});
