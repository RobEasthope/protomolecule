"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sanity_1 = require("sanity");
exports.default = (0, sanity_1.defineType)({
    name: "BasicProse",
    title: "Basic prose",
    type: "array",
    of: [
        (0, sanity_1.defineArrayMember)({
            type: "block",
            styles: [],
            marks: {
                decorators: [
                    { title: "Strong", value: "strong" },
                    { title: "Emphasis", value: "em" },
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
