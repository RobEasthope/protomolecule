"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ri_1 = require("react-icons/ri");
var sanity_1 = require("sanity");
var LINKABLE_DOC_TYPES_1 = require("./LINKABLE_DOC_TYPES");
exports.default = (0, sanity_1.defineType)({
    name: "InternalLink",
    title: "Internal link",
    type: "object",
    description: "Link to a page on the site",
    icon: ri_1.RiLinksLine,
    fields: [
        (0, sanity_1.defineField)({
            name: "internalUID",
            title: "Page",
            type: "reference",
            to: LINKABLE_DOC_TYPES_1.LINKABLE_DOC_TYPES,
            validation: function (Rule) { return Rule.required(); },
        }),
    ],
    preview: {
        prepare: function () {
            return {
                subtitle: "Internal link",
            };
        },
    },
});
