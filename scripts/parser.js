import fs from "fs/promises";
import path from "path";

const CONTENT_DIR = path.resolve(
    process.cwd(),
    "public",
    "data",
    "content"
);

export async function parseContent() {

    const files = await fs.readdir(CONTENT_DIR);

    const jsonFiles = files.filter(file => file.endsWith(".json"));

    const subjects = {};

    for (const file of jsonFiles) {

        const filePath = path.join(CONTENT_DIR, file);

        try {

            const raw = await fs.readFile(filePath, "utf8");

            const json = JSON.parse(raw);

            const subjectName = path.basename(file, ".json");

            subjects[subjectName] = json;

            console.log(`✓ Loaded ${file}`);

        } catch (err) {

            throw new Error(
                `Error reading ${file}\n${err.message}`
            );

        }

    }

    return subjects;

}
