"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ri_1 = require("react-icons/ri");
var sanity_1 = require("sanity");
exports.default = (0, sanity_1.defineType)({
    name: "ExternalLink",
    title: "External link",
    type: "object",
    description: "Add a link to outside the site",
    icon: ri_1.RiExternalLinkLine,
    fields: [
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
        prepare: function () {
            return {
                title: "External link",
            };
        },
    },
});
