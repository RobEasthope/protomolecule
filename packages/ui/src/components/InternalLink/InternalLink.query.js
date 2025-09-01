"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_LINK_QUERY = void 0;
var groq_1 = require("groq");
exports.INTERNAL_LINK_QUERY = (0, groq_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  _type == \"InternalLink\" => {\n    \"page\": @.internalUID->,\n  }\n"], ["\n  _type == \"InternalLink\" => {\n    \"page\": @.internalUID->,\n  }\n"])));
var templateObject_1;
