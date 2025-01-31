"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable guard-for-in, max-len, no-await-in-loop, no-restricted-syntax */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("hardhat/config");
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const Sqrl = __importStar(require("squirrelly"));
const abiDecoder_1 = require("./abiDecoder");
require("./type-extensions");
(0, config_1.extendConfig)((config, userConfig) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    // eslint-disable-next-line no-param-reassign
    config.dodoc = {
        include: ((_a = userConfig.dodoc) === null || _a === void 0 ? void 0 : _a.include) || [],
        exclude: ((_b = userConfig.dodoc) === null || _b === void 0 ? void 0 : _b.exclude) || [],
        runOnCompile: ((_c = userConfig.dodoc) === null || _c === void 0 ? void 0 : _c.runOnCompile) !== undefined ? (_d = userConfig.dodoc) === null || _d === void 0 ? void 0 : _d.runOnCompile : true,
        debugMode: ((_e = userConfig.dodoc) === null || _e === void 0 ? void 0 : _e.debugMode) || false,
        outputDir: ((_f = userConfig.dodoc) === null || _f === void 0 ? void 0 : _f.outputDir) || './docs',
        templatePath: ((_g = userConfig.dodoc) === null || _g === void 0 ? void 0 : _g.templatePath) || path_1.default.join(__dirname, './template.sqrl'),
        keepFileStructure: (_j = (_h = userConfig.dodoc) === null || _h === void 0 ? void 0 : _h.keepFileStructure) !== null && _j !== void 0 ? _j : true,
        freshOutput: (_l = (_k = userConfig.dodoc) === null || _k === void 0 ? void 0 : _k.freshOutput) !== null && _l !== void 0 ? _l : true,
        tableOfContents: (_o = (_m = userConfig.dodoc) === null || _m === void 0 ? void 0 : _m.tableOfContents) !== null && _o !== void 0 ? _o : false,
    };
});
async function generateDocumentation(hre) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const config = hre.config.dodoc;
    const docs = [];
    const qualifiedNames = await hre.artifacts.getAllFullyQualifiedNames();
    const filteredQualifiedNames = qualifiedNames.filter((filePath) => {
        // Checks if the documentation has to be generated for this contract
        const includesPath = config.include.some((str) => filePath.includes(str));
        const excludesPath = config.exclude.some((str) => filePath.includes(str));
        return (config.include.length === 0 || includesPath) && !excludesPath;
    });
    // Loops through all the qualified names to get all the compiled contracts
    const sourcesPath = hre.config.paths.sources.substr(process.cwd().length + 1); // trick to get relative path to files, and trim the first /
    for (const qualifiedName of filteredQualifiedNames) {
        const [source, name] = qualifiedName.split(':');
        const buildInfo = await hre.artifacts.getBuildInfo(qualifiedName);
        const info = buildInfo === null || buildInfo === void 0 ? void 0 : buildInfo.output.contracts[source][name];
        if (config.debugMode) {
            console.log('ABI:\n');
            console.log(JSON.stringify(info.abi, null, 4));
            console.log('\n\n');
            console.log('User doc:\n');
            console.log(JSON.stringify(info.userdoc, null, 4));
            console.log('\n\n');
            console.log('Dev doc:\n');
            console.log(JSON.stringify(info.devdoc, null, 4));
        }
        const doc = Object.assign(Object.assign({}, (0, abiDecoder_1.decodeAbi)(info.abi)), { path: source.substr(sourcesPath.length).split('/').slice(0, -1).join('/') }); // get file path without filename
        // Fetches info from userdoc
        for (const errorSig in (_a = info.userdoc) === null || _a === void 0 ? void 0 : _a.errors) {
            const [errorName] = errorSig.split('(');
            const error = (_b = info.userdoc) === null || _b === void 0 ? void 0 : _b.errors[errorSig][0];
            if (doc.errors[errorName] !== undefined)
                doc.errors[errorName].notice = error === null || error === void 0 ? void 0 : error.notice;
        }
        for (const eventSig in (_c = info.userdoc) === null || _c === void 0 ? void 0 : _c.events) {
            const [eventName] = eventSig.split('(');
            const event = (_d = info.userdoc) === null || _d === void 0 ? void 0 : _d.events[eventSig];
            if (doc.events[eventName] !== undefined)
                doc.events[eventName].notice = event === null || event === void 0 ? void 0 : event.notice;
        }
        for (const methodSig in (_e = info.userdoc) === null || _e === void 0 ? void 0 : _e.methods) {
            // const [methodName] = methodSig.split('(');
            const method = (_f = info.userdoc) === null || _f === void 0 ? void 0 : _f.methods[methodSig];
            if (doc.methods[methodSig] !== undefined)
                doc.methods[methodSig].notice = method === null || method === void 0 ? void 0 : method.notice;
        }
        // Fetches info from devdoc
        for (const errorSig in (_g = info.devdoc) === null || _g === void 0 ? void 0 : _g.errors) {
            const [errorName] = errorSig.split('(');
            const error = (_h = info.devdoc) === null || _h === void 0 ? void 0 : _h.errors[errorSig][0];
            if (doc.errors[errorName] !== undefined)
                doc.errors[errorName].details = error === null || error === void 0 ? void 0 : error.details;
            for (const param in error === null || error === void 0 ? void 0 : error.params) {
                if (doc.errors[errorName].inputs[param])
                    doc.errors[errorName].inputs[param].description = error === null || error === void 0 ? void 0 : error.params[param];
            }
        }
        for (const eventSig in (_j = info.devdoc) === null || _j === void 0 ? void 0 : _j.events) {
            const [eventName] = eventSig.split('(');
            const event = (_k = info.devdoc) === null || _k === void 0 ? void 0 : _k.events[eventSig];
            if (doc.events[eventName] !== undefined)
                doc.events[eventName].details = event === null || event === void 0 ? void 0 : event.details;
            for (const param in event === null || event === void 0 ? void 0 : event.params) {
                if (doc.events[eventName].inputs[param])
                    doc.events[eventName].inputs[param].description = event === null || event === void 0 ? void 0 : event.params[param];
            }
        }
        for (const methodSig in (_l = info.devdoc) === null || _l === void 0 ? void 0 : _l.methods) {
            const [methodName] = methodSig.split('(');
            const method = (_m = info.devdoc) === null || _m === void 0 ? void 0 : _m.methods[methodSig];
            if (doc.methods[methodSig] !== undefined && methodName !== 'constructor') {
                doc.methods[methodSig].details = method === null || method === void 0 ? void 0 : method.details;
                for (const param in method === null || method === void 0 ? void 0 : method.params) {
                    if (doc.methods[methodSig].inputs[param])
                        doc.methods[methodSig].inputs[param].description = method === null || method === void 0 ? void 0 : method.params[param];
                }
                for (const output in method === null || method === void 0 ? void 0 : method.returns) {
                    if (doc.methods[methodSig].outputs[output])
                        doc.methods[methodSig].outputs[output].description = method === null || method === void 0 ? void 0 : method.returns[output];
                }
            }
        }
        for (const varName in (_o = info.devdoc) === null || _o === void 0 ? void 0 : _o.stateVariables) {
            const variable = (_p = info.devdoc) === null || _p === void 0 ? void 0 : _p.stateVariables[varName];
            const abiInfo = info.abi.find((a) => a.name === varName);
            const varNameWithParams = `${varName}(${(abiInfo === null || abiInfo === void 0 ? void 0 : abiInfo.inputs) ? abiInfo.inputs.map((inp) => inp.type).join(',') : ''})`;
            if (doc.methods[varNameWithParams])
                doc.methods[varNameWithParams].details = variable === null || variable === void 0 ? void 0 : variable.details;
            for (const param in variable === null || variable === void 0 ? void 0 : variable.params) {
                if (doc.methods[varNameWithParams].inputs[param])
                    doc.methods[varNameWithParams].inputs[param].description = variable === null || variable === void 0 ? void 0 : variable.params[param];
            }
            for (const output in variable === null || variable === void 0 ? void 0 : variable.returns) {
                if (doc.methods[varNameWithParams].outputs[output])
                    doc.methods[varNameWithParams].outputs[output].description = variable === null || variable === void 0 ? void 0 : variable.returns[output];
            }
        }
        // Fetches global info
        if ((_q = info.devdoc) === null || _q === void 0 ? void 0 : _q.title)
            doc.title = info.devdoc.title;
        if ((_r = info.userdoc) === null || _r === void 0 ? void 0 : _r.notice)
            doc.notice = info.userdoc.notice;
        if ((_s = info.devdoc) === null || _s === void 0 ? void 0 : _s.details)
            doc.details = info.devdoc.details;
        if ((_t = info.devdoc) === null || _t === void 0 ? void 0 : _t.author)
            doc.author = info.devdoc.author;
        doc.name = name;
        docs.push(doc);
    }
    try {
        await fs_1.default.promises.access(config.outputDir);
        if (config.freshOutput) {
            await fs_1.default.promises.rm(config.outputDir, {
                recursive: true,
            });
            await fs_1.default.promises.mkdir(config.outputDir);
        }
    }
    catch (e) {
        await fs_1.default.promises.mkdir(config.outputDir);
    }
    const template = await fs_1.default.promises.readFile(config.templatePath, {
        encoding: 'utf-8',
    });
    for (let i = 0; i < docs.length; i += 1) {
        const result = Sqrl.render(template, docs[i]);
        let docfileName = `${docs[i].name}.md`;
        let testFileName = `${docs[i].name}.json`;
        if (config.keepFileStructure && docs[i].path !== undefined) {
            if (!fs_1.default.existsSync(path_1.default.join(config.outputDir, docs[i].path)))
                await fs_1.default.promises.mkdir(path_1.default.join(config.outputDir, docs[i].path), { recursive: true });
            docfileName = path_1.default.join(docs[i].path, docfileName);
            testFileName = path_1.default.join(docs[i].path, testFileName);
        }
        await fs_1.default.promises.writeFile(path_1.default.join(config.outputDir, docfileName), result, {
            encoding: 'utf-8',
        });
        if (config.debugMode) {
            await fs_1.default.promises.writeFile(path_1.default.join(config.outputDir, testFileName), JSON.stringify(docs[i], null, 4), {
                encoding: 'utf-8',
            });
        }
    }
    if (config.tableOfContents) {
        // Create array for table of contents
        const tocArray = ['# Documentation\n\n### Table of contents\n\n'];
        // Iterate over all docs
        docs.forEach((doc) => {
            const docfileName = `${doc.name}.md`;
            tocArray.push(`* [${doc.name}](${config.keepFileStructure ? path_1.default.join(doc.path || '', docfileName) : docfileName})`);
        });
        // Write the table of contents to the output directory
        await fs_1.default.promises.writeFile(path_1.default.join(config.outputDir, 'README.md'), tocArray.join('\n'), {
            encoding: 'utf-8',
        });
    }
    console.log('✅ Generated documentation for', docs.length, docs.length > 1 ? 'contracts' : 'contract');
}
// Custom standalone task
(0, config_1.task)('dodoc', 'Generates NatSpec documentation for the project')
    .addFlag('noCompile', 'Prevents compiling before running this task')
    .setAction(async (args, hre) => {
    if (!args.noCompile) {
        await hre.run(task_names_1.TASK_COMPILE, { noDodoc: true });
    }
    await generateDocumentation(hre);
});
// Overriding task triggered when COMPILE is called
(0, config_1.task)(task_names_1.TASK_COMPILE)
    .addFlag('noDodoc', 'Prevents generating NatSpec documentation for the project')
    .setAction(async (args, hre, runSuper) => {
    // Updates the compiler settings
    for (const compiler of hre.config.solidity.compilers) {
        compiler.settings.outputSelection['*']['*'].push('devdoc');
        compiler.settings.outputSelection['*']['*'].push('userdoc');
    }
    // Compiles the contracts
    await runSuper();
    if (hre.config.dodoc.runOnCompile && !args.noDodoc) {
        await hre.run('dodoc', { noCompile: true });
    }
});
//# sourceMappingURL=index.js.map