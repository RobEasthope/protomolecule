"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoChildren = exports.Primary = void 0;
var Type_1 = require("./Type");
var meta = {
    title: "Base UI/Type",
    component: Type_1.Type,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};
exports.default = meta;
exports.Primary = {
    args: {
        as: "p",
        children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
};
exports.NoChildren = {
    args: {
        as: "p",
        children: null,
    },
};
