import { parseContent } from "./parser.js";
import { buildNavigation } from "./builder.js";
import { validateNavigation } from "./validator.js";
import { writeNavigation } from "./writer.js";

async function generate() {
    console.log("================================");
    console.log(" Study Vault Navigation Builder ");
    console.log("================================");

    const content = await parseContent();

    const navigation = buildNavigation(content);

    validateNavigation(navigation);

    await writeNavigation(navigation);

    console.log("");
    console.log("Navigation generated successfully.");
}

generate().catch(err => {
    console.error(err);
    process.exit(1);
});