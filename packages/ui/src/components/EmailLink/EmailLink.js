"use strict";
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
exports.EmailLink = void 0;
var react_1 = require("react");
var tailwind_1 = require("@/utils/tailwind");
function EmailLink(_a) {
    var email = _a.email, children = _a.children, className = _a.className, rest = __rest(_a, ["email", "children", "className"]);
    if (!email && !children) {
        return null;
    }
    if (!email) {
        return <span className={className}>{children || null}</span>;
    }
    return (<a href={"mailto:".concat(email)} target="_blank" rel="noopener noreferrer" className={(0, tailwind_1.cn)(className, "hover:text-saffron duration-300")} {...rest}>
      {children || null}
    </a>);
}
exports.EmailLink = EmailLink;
