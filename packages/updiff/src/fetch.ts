#!/usr/bin/env node
import got from "got";
import fs from "fs";
import rimraf from "rimraf";

async function fetch(user: string, repo: string, out: string, includeFiles: RegExp, excludeFiles: RegExp) {
    const repoPrefixRaw = `https://raw.githubusercontent.com/${user}/${repo}/master`;
    const repoPrefixApi = `https://api.github.com/repos/${user}/${repo}`;

    const jsonData = await got<any>(`${repoPrefixApi}/git/trees/master?recursive=1`, { responseType: "json" }).then(
        (res) => res.body,
    );

    const paths: string[] = jsonData.tree
        .filter((node: any) => node.type === "blob")
        .map((e: any) => e.path)
        .filter((path: string) => includeFiles.test(path))
        .filter((path: string) => !excludeFiles.test(path));

    const outPath = `dist/${out}`;
    if (fs.existsSync(outPath)) rimraf.sync(outPath);
    fs.mkdirSync(outPath, { recursive: true });

    const fetches = paths.map(async (path) => {
        try {
            const response = await got(`${repoPrefixRaw}/${path}`);

            const parts = path.split("/");
            const filename = parts[parts.length - 1];
            fs.writeFileSync(`${outPath}/${filename}`, response.body);
        } catch (e) {
            console.error(path, e);
        }
    });

    await Promise.all(fetches);
}

async function fetchAll() {
    await fetch(
        "erincatto",
        "box2d",
        "cpp",
        /^(include\/box2d\/|src\/).*\.(cpp|h)$/i,
        /(allocator|growable_stack|b2_api)/i,
    );
}

fetchAll();