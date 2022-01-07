import {copyFileSync, existsSync, readFileSync, writeFileSync} from "fs";

export const readFile = <T>(filePath: string): T => existsSync(filePath) && JSON.parse(readFileSync(filePath) as any);

export const writeFile = (filePath: string, data: Record<string, unknown>): void => {
    writeFileSync(filePath, JSON.stringify(data));
};

export const copyFileIfNotExist = (from: string, to: string): void => {
    if (!existsSync(to) && existsSync(from)) {
        copyFileSync(from, to);
    }
};
