"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
var react_1 = require("react");
var tailwind_1 = require("@/utils/tailwind");
var checkForStylingClasses_1 = require("@/utils/checkForStylingClasses");
var Box = function (_a) {
    var _b = _a.as, as = _b === void 0 ? "div" : _b, className = _a.className, children = _a.children, ref = _a.ref, props = __rest(_a, ["as", "className", "children", "ref"]);
    if (!children)
        return null;
    return (0, react_1.createElement)(as, __assign({ className: (0, checkForStylingClasses_1.checkForStylingClasses)((0, tailwind_1.cn)(className)), ref: ref }, props), children);
};
exports.Box = Box;
Box.displayName = "Box";
