"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoChildren = exports.Primary = void 0;
var Container_1 = require("./Container");
var meta = {
    title: "Base UI/Container",
    component: Container_1.Container,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};
exports.default = meta;
exports.Primary = {
    args: {
        as: "section",
        children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
};
exports.NoChildren = {
    args: {
        as: "div",
        children: null,
    },
};
