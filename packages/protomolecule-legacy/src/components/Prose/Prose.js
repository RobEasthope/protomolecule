"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prose = void 0;
var react_1 = require("@portabletext/react");
var Box_1 = require("@/components/Box/Box");
var tailwind_1 = require("@/utils/tailwind");
function Prose(_a) {
    var _b = _a.as, as = _b === void 0 ? "div" : _b, content = _a.content, components = _a.components, className = _a.className;
    if (!content) {
        return null;
    }
    return (<Box_1.Box as={as} className={(0, tailwind_1.cn)("prose", "text-ink", className)}>
      <react_1.PortableText value={content} components={components}/>
    </Box_1.Box>);
}
exports.Prose = Prose;
