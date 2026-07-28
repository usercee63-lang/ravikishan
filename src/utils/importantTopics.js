export function getImportantTopics(navigationData) {
  if (!navigationData?.chapters) return [];

  const topics = [];

  navigationData.chapters.forEach((chapter) => {
    chapter.topics.forEach((topic) => {
      if (topic.important) {
        topics.push({
          subject: navigationData.subject,
          chapter: chapter.id,
          chapterTitle: chapter.title,
          topic: topic.id,
          title: topic.title,
        });
      }
    });
  });

  return topics;
}