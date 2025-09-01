"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@testing-library/react");
var vitest_1 = require("vitest");
var Container_1 = require("./Container");
(0, vitest_1.describe)("Container", function () {
    (0, vitest_1.it)("renders children correctly", function () {
        (0, react_1.render)(<Container_1.Container as="div">Lorem ipsum</Container_1.Container>);
        (0, vitest_1.expect)(react_1.screen.getByText("Lorem ipsum")).toBeInTheDocument();
    });
    (0, vitest_1.it)("applies custom className", function () {
        (0, react_1.render)(<Container_1.Container as="section" className="custom-class">
        Content
      </Container_1.Container>);
        var container = react_1.screen.getByText("Content");
        (0, vitest_1.expect)(container).toHaveClass("custom-class");
    });
    (0, vitest_1.it)("renders as different HTML elements", function () {
        var rerender = (0, react_1.render)(<Container_1.Container as="article">Article content</Container_1.Container>).rerender;
        var element = react_1.screen.getByText("Article content");
        (0, vitest_1.expect)(element.tagName).toBe("ARTICLE");
        rerender(<Container_1.Container as="main">Main content</Container_1.Container>);
        element = react_1.screen.getByText("Main content");
        (0, vitest_1.expect)(element.tagName).toBe("MAIN");
    });
    (0, vitest_1.it)("applies maxWidth variant", function () {
        (0, react_1.render)(<Container_1.Container as="div" maxWidth="small">
        Small container
      </Container_1.Container>);
        var container = react_1.screen.getByText("Small container");
        (0, vitest_1.expect)(container).toHaveClass("max-w-lg");
    });
    (0, vitest_1.it)("applies breakout variant", function () {
        (0, react_1.render)(<Container_1.Container as="div" breakout>
        Breakout container
      </Container_1.Container>);
        var container = react_1.screen.getByText("Breakout container");
        (0, vitest_1.expect)(container).toHaveClass("w-screen");
    });
});
