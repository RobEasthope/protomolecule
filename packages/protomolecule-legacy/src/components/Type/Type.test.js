"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@testing-library/react");
var vitest_1 = require("vitest");
var Type_1 = require("./Type");
(0, vitest_1.describe)("Type", function () {
    (0, vitest_1.it)("renders children correctly", function () {
        (0, react_1.render)(<Type_1.Type as="div">Lorem ipsum</Type_1.Type>);
        (0, vitest_1.expect)(react_1.screen.getByText("Lorem ipsum")).toBeInTheDocument();
    });
    (0, vitest_1.it)("renders as different HTML elements", function () {
        var rerender = (0, react_1.render)(<Type_1.Type as="h1">Heading</Type_1.Type>).rerender;
        var element = react_1.screen.getByText("Heading");
        (0, vitest_1.expect)(element.tagName).toBe("H1");
        rerender(<Type_1.Type as="p">Paragraph</Type_1.Type>);
        element = react_1.screen.getByText("Paragraph");
        (0, vitest_1.expect)(element.tagName).toBe("P");
    });
    (0, vitest_1.it)("applies custom className", function () {
        (0, react_1.render)(<Type_1.Type as="span" className="text-lg font-bold">
        Styled text
      </Type_1.Type>);
        var element = react_1.screen.getByText("Styled text");
        (0, vitest_1.expect)(element).toHaveClass("text-lg", "font-bold");
    });
});
