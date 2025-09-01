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
exports.ReactRouterLink = void 0;
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
function ReactRouterLink(_a) {
    var href = _a.href, children = _a.children, className = _a.className, homePageSlug = _a.homePageSlug, rest = __rest(_a, ["href", "children", "className", "homePageSlug"]);
    if (!href && !children) {
        return null;
    }
    if (!href) {
        return <span className={className}>{children || null}</span>;
    }
    return (<react_router_dom_1.Link to={href === homePageSlug ? "/" : "/".concat(href)} role="link" tabIndex={0} className={className} {...rest}>
      {children || null}
    </react_router_dom_1.Link>);
}
exports.ReactRouterLink = ReactRouterLink;
