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
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var NextInternalLink_1 = require("./NextInternalLink");
// Mock next/link
vitest_1.vi.mock("next/link", function () { return ({
    default: function (_a) {
        var children = _a.children, href = _a.href, props = __rest(_a, ["children", "href"]);
        return (<a href={href} {...props}>
      {children}
    </a>);
    },
}); });
(0, vitest_1.describe)("NextInternalLink", function () {
    (0, vitest_1.it)("renders null when no href and no children", function () {
        var container = (0, react_1.render)(<NextInternalLink_1.NextInternalLink href={undefined}>
        {null}
      </NextInternalLink_1.NextInternalLink>).container;
        (0, vitest_1.expect)(container.firstChild).toBeNull();
    });
    (0, vitest_1.it)("renders a span when no href but has children", function () {
        (0, react_1.render)(<NextInternalLink_1.NextInternalLink href={undefined} className="test-class">
        Test Content
      </NextInternalLink_1.NextInternalLink>);
        var span = react_1.screen.getByText("Test Content");
        (0, vitest_1.expect)(span.tagName).toBe("SPAN");
        (0, vitest_1.expect)(span.className).toBe("test-class");
    });
    (0, vitest_1.it)("renders a Link with correct href for regular pages", function () {
        (0, react_1.render)(<NextInternalLink_1.NextInternalLink href="about" className="link-class">
        About Page
      </NextInternalLink_1.NextInternalLink>);
        var link = react_1.screen.getByRole("link");
        (0, vitest_1.expect)(link.getAttribute("href")).toBe("/about");
        (0, vitest_1.expect)(link.className).toBe("link-class");
        (0, vitest_1.expect)(link.textContent).toBe("About Page");
    });
    (0, vitest_1.it)("renders a Link with root href when href matches homePageSlug", function () {
        (0, react_1.render)(<NextInternalLink_1.NextInternalLink href="home" homePageSlug="home" className="home-link">
        Home
      </NextInternalLink_1.NextInternalLink>);
        var link = react_1.screen.getByRole("link");
        (0, vitest_1.expect)(link.getAttribute("href")).toBe("/");
        (0, vitest_1.expect)(link.textContent).toBe("Home");
    });
    (0, vitest_1.it)("passes through additional props to Link", function () {
        (0, react_1.render)(<NextInternalLink_1.NextInternalLink href="contact" data-testid="custom-link" aria-label="Contact us">
        Contact
      </NextInternalLink_1.NextInternalLink>);
        var link = react_1.screen.getByRole("link");
        (0, vitest_1.expect)(link.getAttribute("data-testid")).toBe("custom-link");
        (0, vitest_1.expect)(link.getAttribute("aria-label")).toBe("Contact us");
        (0, vitest_1.expect)(link.getAttribute("tabindex")).toBe("0");
    });
    (0, vitest_1.it)("handles undefined homePageSlug correctly", function () {
        (0, react_1.render)(<NextInternalLink_1.NextInternalLink href="home" homePageSlug={undefined}>
        Home Link
      </NextInternalLink_1.NextInternalLink>);
        var link = react_1.screen.getByRole("link");
        (0, vitest_1.expect)(link.getAttribute("href")).toBe("/home");
    });
    (0, vitest_1.it)("applies className correctly", function () {
        (0, react_1.render)(<NextInternalLink_1.NextInternalLink href="services" className="text-blue-500 hover:text-blue-700">
        Services
      </NextInternalLink_1.NextInternalLink>);
        var link = react_1.screen.getByRole("link");
        (0, vitest_1.expect)(link.className).toBe("text-blue-500 hover:text-blue-700");
    });
    (0, vitest_1.it)("handles empty string href", function () {
        (0, react_1.render)(<NextInternalLink_1.NextInternalLink href="" className="empty-href">
        Empty Href Link
      </NextInternalLink_1.NextInternalLink>);
        var span = react_1.screen.getByText("Empty Href Link");
        (0, vitest_1.expect)(span.tagName).toBe("SPAN");
        (0, vitest_1.expect)(span.className).toBe("empty-href");
    });
    (0, vitest_1.it)("renders children correctly when they are React elements", function () {
        (0, react_1.render)(<NextInternalLink_1.NextInternalLink href="products">
        <span>Products</span>
        <span> Page</span>
      </NextInternalLink_1.NextInternalLink>);
        var link = react_1.screen.getByRole("link");
        (0, vitest_1.expect)(link.textContent).toBe("Products Page");
    });
});
