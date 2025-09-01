"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicProseComponents = void 0;
var Type_1 = require("@/components/Type/Type");
var EmailLink_1 = require("@/components/EmailLink/EmailLink");
var ExternalLink_1 = require("@/components/ExternalLink/ExternalLink");
var ReactRouterLink_1 = require("@/components/InternalLink/ReactRouterLink");
// export type BasicProseProps = Array<SanityKeyed<SanityBlock>>;
exports.BasicProseComponents = {
    block: {
        normal: function (_a) {
            var children = _a.children;
            return <Type_1.Type as="p">{children}</Type_1.Type>;
        },
    },
    marks: {
        // Text highlighting
        strong: function (_a) {
            var children = _a.children;
            return (<strong className="font-medium text-inherit">{children}</strong>);
        },
        em: function (_a) {
            var children = _a.children;
            return <em className="italic text-inherit">{children}</em>;
        },
        // Links
        ExternalLink: function (_a) {
            var children = _a.children, value = _a.value;
            return (<ExternalLink_1.ExternalLink href={value.url}>{children}</ExternalLink_1.ExternalLink>);
        },
        InternalLink: function (_a) {
            var _b, _c, _d;
            var children = _a.children, value = _a.value;
            return (<ReactRouterLink_1.ReactRouterLink href={(_c = (_b = value === null || value === void 0 ? void 0 : value.page) === null || _b === void 0 ? void 0 : _b.slug) === null || _c === void 0 ? void 0 : _c.current} homePageSlug={(_d = value === null || value === void 0 ? void 0 : value.appSettings) === null || _d === void 0 ? void 0 : _d.homePageSlug}>
        {children}
      </ReactRouterLink_1.ReactRouterLink>);
        },
        EmailLink: function (_a) {
            var children = _a.children, value = _a.value;
            return (<EmailLink_1.EmailLink email={value === null || value === void 0 ? void 0 : value.email}>{children}</EmailLink_1.EmailLink>);
        },
    },
};
