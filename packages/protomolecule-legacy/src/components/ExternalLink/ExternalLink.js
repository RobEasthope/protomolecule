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
exports.ExternalLink = void 0;
var tailwind_1 = require("@/utils/tailwind");
function ExternalLink(_a) {
    var href = _a.href, children = _a.children, className = _a.className, rest = __rest(_a, ["href", "children", "className"]);
    if (!href && !children) {
        return null;
    }
    return (<a href={href} target="_blank" rel="noopener noreferrer" className={(0, tailwind_1.cn)("duration-300 hover:text-link", className)} {...rest}>
      {children || null}
    </a>);
}
exports.ExternalLink = ExternalLink;
