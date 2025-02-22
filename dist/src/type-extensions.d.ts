import 'hardhat/types/config';
declare module 'hardhat/types/config' {
    interface HardhatUserConfig {
        dodoc?: {
            include?: string[];
            exclude?: string[];
            runOnCompile?: boolean;
            debugMode?: boolean;
            templatePath?: string;
            outputDir?: string;
            keepFileStructure?: boolean;
            freshOutput?: boolean;
            tableOfContents?: boolean;
        };
    }
    interface HardhatConfig {
        dodoc: {
            include: string[];
            exclude: string[];
            runOnCompile: boolean;
            debugMode: boolean;
            templatePath: string;
            outputDir: string;
            keepFileStructure: boolean;
            freshOutput: boolean;
            tableOfContents: boolean;
        };
    }
}
//# sourceMappingURL=type-extensions.d.ts.map