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
exports.OmniLink = void 0;
var EmailLink_1 = require("@/components/EmailLink/EmailLink");
var ExternalLink_1 = require("@/components/ExternalLink/ExternalLink");
var ReactRouterLink_1 = require("@/components/InternalLink/ReactRouterLink");
var react_1 = require("react");
var OmniLink = function (_a) {
    var link = _a.link, className = _a.className, children = _a.children, rest = __rest(_a, ["link", "className", "children"]);
    if (!link && !children) {
        return null;
    }
    switch (link === null || link === void 0 ? void 0 : link._type) {
        case "EmailLinkWithTitle":
            return (<EmailLink_1.EmailLink email={link === null || link === void 0 ? void 0 : link.href} className={className} {...rest}>
          {children}
        </EmailLink_1.EmailLink>);
        case "ExternalLinkWithTitle":
            return (<ExternalLink_1.ExternalLink href={link === null || link === void 0 ? void 0 : link.href} className={className} {...rest}>
          {children}
        </ExternalLink_1.ExternalLink>);
        case "InternalLinkWithTitle":
            return (<ReactRouterLink_1.ReactRouterLink href={link === null || link === void 0 ? void 0 : link.href} className={className} {...rest}>
          {children}
        </ReactRouterLink_1.ReactRouterLink>);
        default:
            return null;
    }
};
exports.OmniLink = OmniLink;
