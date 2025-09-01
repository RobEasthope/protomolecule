"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@testing-library/react");
var vitest_1 = require("vitest");
var Box_1 = require("./Box");
(0, vitest_1.describe)('Box', function () {
    (0, vitest_1.it)('renders children correctly', function () {
        (0, react_1.render)(<Box_1.Box as="div">Lorem ipsum</Box_1.Box>);
        (0, vitest_1.expect)(react_1.screen.getByText('Lorem ipsum')).toBeInTheDocument();
    });
    (0, vitest_1.it)('returns null when no children provided', function () {
        var container = (0, react_1.render)(<Box_1.Box as="div">{null}</Box_1.Box>).container;
        (0, vitest_1.expect)(container.firstChild).toBeNull();
    });
    (0, vitest_1.it)('applies custom className', function () {
        (0, react_1.render)(<Box_1.Box as="span" className="text-red-500">
        Styled text
      </Box_1.Box>);
        var element = react_1.screen.getByText('Styled text');
        (0, vitest_1.expect)(element).toHaveClass('text-red-500');
    });
    (0, vitest_1.it)('renders as different HTML elements', function () {
        var rerender = (0, react_1.render)(<Box_1.Box as="section">Section content</Box_1.Box>).rerender;
        var element = react_1.screen.getByText('Section content');
        (0, vitest_1.expect)(element.tagName).toBe('SECTION');
        rerender(<Box_1.Box as="article">Article content</Box_1.Box>);
        element = react_1.screen.getByText('Article content');
        (0, vitest_1.expect)(element.tagName).toBe('ARTICLE');
    });
    (0, vitest_1.it)('accepts ref prop', function () {
        var ref = { current: null };
        (0, react_1.render)(<Box_1.Box as="div" ref={ref}>
        With ref
      </Box_1.Box>);
        (0, vitest_1.expect)(ref.current).toBeInstanceOf(HTMLDivElement);
    });
});
