export function buildNavigation(content) {

    const navigation = {};

    for (const [subjectName, subjectContent] of Object.entries(content)) {

        const chapters = {};

        for (const id of Object.keys(subjectContent)) {

            const parts = id.split("__");

            if (parts.length < 3) {
                console.warn(`Invalid ID: ${id}`);
                continue;
            }

            const [, chapterId, topicId] = parts;

            if (!chapters[chapterId]) {

                chapters[chapterId] = {
                    id: chapterId,
                    title: formatTitle(chapterId),
                    topics: []
                };

            }

            chapters[chapterId].topics.push({
                id,
                title: formatTitle(topicId)
            });

        }

        navigation[subjectName] = {
            id: subjectName,
            title: formatTitle(subjectName),
            chapters: Object.values(chapters)
        };

    }

    return navigation;

}

function formatTitle(text) {

    return text
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());

}
