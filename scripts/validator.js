export function validateNavigation(navigation) {

    console.log("");
    console.log("Validating navigation...");

    const duplicateIds = new Set();

    for (const [subjectName, subject] of Object.entries(navigation)) {

        if (!subject.chapters || !Array.isArray(subject.chapters)) {
            throw new Error(`${subjectName}: chapters must be an array.`);
        }

        for (const chapter of subject.chapters) {

            if (!chapter.id) {
                throw new Error(`${subjectName}: chapter missing id.`);
            }

            if (!chapter.title) {
                throw new Error(`${subjectName}: ${chapter.id} missing title.`);
            }

            if (!Array.isArray(chapter.topics)) {
                throw new Error(`${subjectName}: ${chapter.id} topics must be an array.`);
            }

            for (const topic of chapter.topics) {

                if (!topic.id) {
                    throw new Error(`${subjectName}: topic missing id.`);
                }

                if (duplicateIds.has(topic.id)) {
                    throw new Error(`Duplicate topic id found: ${topic.id}`);
                }

                duplicateIds.add(topic.id);

                if (!topic.title) {
                    console.warn(`Warning: ${topic.id} has no title.`);
                }

            }

        }

    }

    console.log("✓ Validation passed");
}
