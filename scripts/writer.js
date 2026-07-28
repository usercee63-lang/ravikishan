import fs from "fs/promises";
import path from "path";

const NAVIGATION_DIR = path.resolve(
    process.cwd(),
    "public",
    "data",
    "navigation"
);

export async function writeNavigation(navigation) {

    await fs.mkdir(NAVIGATION_DIR, { recursive: true });

    console.log("");
    console.log("Writing navigation files...");

    for (const [subjectName, subjectData] of Object.entries(navigation)) {

        const filePath = path.join(
            NAVIGATION_DIR,
            `${subjectName}.json`
        );

        await fs.writeFile(
            filePath,
            JSON.stringify(subjectData, null, 2),
            "utf8"
        );

        console.log(`✓ ${subjectName}.json written`);

    }

    console.log("");
    console.log("All navigation files generated.");

}
