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
exports.Container = void 0;
var react_1 = require("react");
var tailwind_1 = require("@/utils/tailwind");
var class_variance_authority_1 = require("class-variance-authority");
var checkForStylingClasses_1 = require("@/utils/checkForStylingClasses");
var containerVariants = (0, class_variance_authority_1.cva)(
// Base styles
null, {
    variants: {
        breakout: {
            true: "max-w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] w-screen",
        },
        maxWidth: {
            none: "",
            auto: "max-w-auto",
            small: "max-w-lg",
            text: "max-w-prose",
            medium: "max-w-5xl",
            large: "max-w-7xl",
            full: "w-screen",
        },
    },
    defaultVariants: {
        maxWidth: null,
    },
});
function Container(_a) {
    var _b = _a.as, as = _b === void 0 ? "div" : _b, className = _a.className, breakout = _a.breakout, maxWidth = _a.maxWidth, children = _a.children, props = __rest(_a, ["as", "className", "breakout", "maxWidth", "children"]);
    if (!children)
        return null;
    return (0, react_1.createElement)(as, __assign({ className: (0, checkForStylingClasses_1.checkForStylingClasses)((0, tailwind_1.cn)(containerVariants({ breakout: breakout, maxWidth: maxWidth }), className)) }, props), children);
}
exports.Container = Container;
Container.displayName = "Container";
