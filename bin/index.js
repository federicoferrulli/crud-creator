#!/usr/bin/env node
import { program } from "commander";
import { readFile, writeFile } from "fs/promises";

const directory = process.cwd();
const fileName = process.argv.at(2);

if (!fileName) {
    console.log("Insert an example file!");
    process.exit();
}

let json = null;
try {
    let file = null;
    file = await readFile(`${directory}/${fileName}.json`, "utf-8");
    json = JSON.parse(file);
} catch (e) {
    console.error(e);
    process.exit();
}

console.log(json);
process.exit();
