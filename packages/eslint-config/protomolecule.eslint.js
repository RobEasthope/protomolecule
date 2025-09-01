"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var protomolecule_eslintSource_1 = require("./protomolecule.eslintSource");
var auto_1 = require("eslint-config-canonical/auto");
var typescript_eslint_1 = require("typescript-eslint");
exports.default = typescript_eslint_1.default.config.apply(typescript_eslint_1.default, __spreadArray(__spreadArray([protomolecule_eslintSource_1.baseConfig], auto_1.default, false), [protomolecule_eslintSource_1.packageJsonConfig,
    protomolecule_eslintSource_1.storybookConfig,
    protomolecule_eslintSource_1.customRules], false));
