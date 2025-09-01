"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sanity_1 = require("sanity");
exports.default = (0, sanity_1.defineType)({
    name: "FullProse",
    title: "Full prose",
    type: "array",
    of: [
        (0, sanity_1.defineArrayMember)({
            type: "block",
            styles: [
                { title: "Normal", value: "normal" },
                { title: "Large heading", value: "h2" },
                { title: "Medium heading", value: "h3" },
                { title: "Small heading", value: "h4" },
            ],
            marks: {
                decorators: [
                    { title: "Strong", value: "strong" },
                    { title: "Emphasis", value: "em" },
                    { title: "Code", value: "code" },
                ],
                annotations: [
                    { type: "InternalLink" },
                    { type: "ExternalLink" },
                    { type: "EmailLink" },
                ],
            },
        }),
    ],
});
