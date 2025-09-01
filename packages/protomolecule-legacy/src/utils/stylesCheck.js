"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stylesCheck = void 0;
// Prevents return of an empty HTML class attribute.
function stylesCheck(styles) {
    if (!styles)
        return undefined;
    return styles;
}
exports.stylesCheck = stylesCheck;
