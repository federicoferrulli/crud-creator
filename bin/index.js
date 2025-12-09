import { program } from "commander";
import {
    createReadStream,
    existsSync,
    lstatSync,
    mkdirSync
} from "fs";
import Parser from "stream-json/Parser.js";
import StreamArray from "stream-json/streamers/StreamArray.js";
import Pick from "stream-json/filters/Pick.js";

const directory = process.cwd();
const argFile = process.argv.at(2);

if (!argFile) {
    console.log("Insert an example file!");
    process.exit(1);
}

const fileName = argFile.endsWith('.json') ? argFile : `${argFile}.json`;
const filePath = `${directory}/${fileName}`;

if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

try {
    // Non voglio saturare la memoria con un file grande
    const pipeline = createReadStream(filePath)
        .pipe(Parser.parser())
        .pipe(Pick.pick({ filter: 'collections' }))
        .pipe(StreamArray.streamArray());

    pipeline.on('data', ({ value }) => {
        console.log(value)

        if (!value.name) {
            return;
        }

        const currFilePath = `${directory}/${value.name}`;

        if (!existsSync(currFilePath) || !lstatSync(currFilePath).isDirectory()) {
            mkdirSync(currFilePath);
        }   

    });

    pipeline.on('end', () => {
        console.log('All Created!');
    });

    pipeline.on('error', (e) => {
        console.error("Error parsing JSON:", e.message);
    });

} catch (e) {
    console.error(e);
    process.exit(1);
}
