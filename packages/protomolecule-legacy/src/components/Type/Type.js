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
exports.Type = void 0;
var react_1 = require("react");
var class_variance_authority_1 = require("class-variance-authority");
var tailwind_1 = require("@/utils/tailwind");
var stylesCheck_1 = require("@/utils/stylesCheck");
var typeVariants = (0, class_variance_authority_1.cva)(
// Root/base styles
null, {
    variants: {
        variant: {
            // General
            base: "text-base",
        },
    },
    defaultVariants: {
        variant: "base",
    },
});
function Type(_a) {
    var _b = _a.as, as = _b === void 0 ? "p" : _b, _c = _a.variant, variant = _c === void 0 ? "base" : _c, className = _a.className, children = _a.children, rest = __rest(_a, ["as", "variant", "className", "children"]);
    if (!children) {
        return null;
    }
    return (0, react_1.createElement)(as, __assign({ className: (0, stylesCheck_1.stylesCheck)((0, tailwind_1.cn)(typeVariants({ variant: variant }), className)) }, rest), children);
}
exports.Type = Type;
