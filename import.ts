import { readdir } from "fs/promises";
import { join } from "path";

const pagesDir = join(__dirname, "app/src");

export default async function importAllPages() {
    try {
        const files = await readdir(pagesDir);
        const imports = files.map(async (file: string) => {
            const filePath = join(pagesDir, file);
            const module = await import(filePath);
            return {
                route: file.split(".ts")[0],
                page: module.default
            };
        });
        const modules = await Promise.all(imports);
        return modules;
    } catch (err) {
        console.error("Server-side error occured", err);
        process.exit(1);
    }
}