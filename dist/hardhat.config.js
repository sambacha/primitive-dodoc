"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("./src");
const config = {
    solidity: '0.8.9',
    paths: {
        sources: './examples/contracts/',
    },
    dodoc: {
        debugMode: true,
        outputDir: './examples/docs',
        exclude: ['excluded'],
        runOnCompile: true,
        tableOfContents: true,
    },
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map