"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoChildren = exports.Primary = void 0;
var Box_1 = require("./Box");
var meta = {
    title: 'Base UI/Box',
    component: Box_1.Box,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Primary = {
    args: {
        as: 'section',
        children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
};
exports.NoChildren = {
    args: {
        as: 'div',
        children: null,
    },
};
