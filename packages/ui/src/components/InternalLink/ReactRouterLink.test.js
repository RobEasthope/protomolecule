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
var ReactRouterLink_1 = require("./ReactRouterLink");
// Mock react-router-dom
vitest_1.vi.mock("react-router-dom", function () { return ({
    Link: function (_a) {
        var children = _a.children, to = _a.to, props = __rest(_a, ["children", "to"]);
        return (<a href={to} {...props}>
      {children}
    </a>);
    },
}); });
(0, vitest_1.describe)("ReactRouterLink", function () {
    (0, vitest_1.it)("renders null when no href and no children", function () {
        var container = (0, react_1.render)(<ReactRouterLink_1.ReactRouterLink href={undefined}>
        {null}
      </ReactRouterLink_1.ReactRouterLink>).container;
        (0, vitest_1.expect)(container.firstChild).toBeNull();
    });
    (0, vitest_1.it)("renders a span when no href but has children", function () {
        (0, react_1.render)(<ReactRouterLink_1.ReactRouterLink href={undefined} className="test-class">
        Test Content
      </ReactRouterLink_1.ReactRouterLink>);
        var span = react_1.screen.getByText("Test Content");
        (0, vitest_1.expect)(span.tagName).toBe("SPAN");
        (0, vitest_1.expect)(span.className).toBe("test-class");
    });
    (0, vitest_1.it)("renders a Link with correct href for regular pages", function () {
        (0, react_1.render)(<ReactRouterLink_1.ReactRouterLink href="about" className="link-class">
        About Page
      </ReactRouterLink_1.ReactRouterLink>);
        var link = react_1.screen.getByRole("link");
        (0, vitest_1.expect)(link.getAttribute("href")).toBe("/about");
        (0, vitest_1.expect)(link.className).toBe("link-class");
        (0, vitest_1.expect)(link.textContent).toBe("About Page");
    });
    (0, vitest_1.it)("renders a Link with root href when href matches homePageSlug", function () {
        (0, react_1.render)(<ReactRouterLink_1.ReactRouterLink href="home" homePageSlug="home" className="home-link">
        Home
      </ReactRouterLink_1.ReactRouterLink>);
        var link = react_1.screen.getByRole("link");
        (0, vitest_1.expect)(link.getAttribute("href")).toBe("/");
        (0, vitest_1.expect)(link.textContent).toBe("Home");
    });
    (0, vitest_1.it)("passes through additional props to Link", function () {
        (0, react_1.render)(<ReactRouterLink_1.ReactRouterLink href="contact" data-testid="custom-link" aria-label="Contact us">
        Contact
      </ReactRouterLink_1.ReactRouterLink>);
        var link = react_1.screen.getByRole("link");
        (0, vitest_1.expect)(link.getAttribute("data-testid")).toBe("custom-link");
        (0, vitest_1.expect)(link.getAttribute("aria-label")).toBe("Contact us");
        (0, vitest_1.expect)(link.getAttribute("tabindex")).toBe("0");
    });
    (0, vitest_1.it)("handles undefined homePageSlug correctly", function () {
        (0, react_1.render)(<ReactRouterLink_1.ReactRouterLink href="home" homePageSlug={undefined}>
        Home Link
      </ReactRouterLink_1.ReactRouterLink>);
        var link = react_1.screen.getByRole("link");
        (0, vitest_1.expect)(link.getAttribute("href")).toBe("/home");
    });
    (0, vitest_1.it)("applies className correctly", function () {
        (0, react_1.render)(<ReactRouterLink_1.ReactRouterLink href="services" className="text-blue-500 hover:text-blue-700">
        Services
      </ReactRouterLink_1.ReactRouterLink>);
        var link = react_1.screen.getByRole("link");
        (0, vitest_1.expect)(link.className).toBe("text-blue-500 hover:text-blue-700");
    });
});
