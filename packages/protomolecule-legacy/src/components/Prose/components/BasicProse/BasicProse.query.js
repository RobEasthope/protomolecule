"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASIC_PROSE_QUERY = void 0;
var groq_1 = require("groq");
var InternalLink_query_1 = require("@/components/InternalLink/InternalLink.query");
exports.BASIC_PROSE_QUERY = (0, groq_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ...,\n  markDefs[]{\n    ...,\n    ", ",\n  },\n"], ["\n  ...,\n  markDefs[]{\n    ...,\n    ", ",\n  },\n"])), InternalLink_query_1.INTERNAL_LINK_QUERY);
var templateObject_1;
