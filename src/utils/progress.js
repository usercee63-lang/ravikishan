const KEY = "study-progress";

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

function getKey(subject, chapter, topic) {
  return `${subject}/${chapter}/${topic}`;
}

export function getTopicProgress(subject, chapter, topic) {
  const progress = readProgress();
  return progress[getKey(subject, chapter, topic)] || "not-started";
}

export function setTopicProgress(subject, chapter, topic, status) {
  const progress = readProgress();

  progress[getKey(subject, chapter, topic)] = status;

  saveProgress(progress);
}

export function getAllProgress() {
  return readProgress();
}

export function calculateSubjectProgress(subject, navigation) {
  const progress = readProgress();

  let total = 0;
  let completed = 0;

  navigation.chapters.forEach((chapter) => {
    chapter.topics.forEach((topic) => {
      total++;

      const key = `${subject}/${chapter.id}/${topic.id}`;

      if (progress[key] === "completed") {
        completed++;
      }
    });
  });

  return {
    completed,
    total,
    percentage:
      total === 0
        ? 0
        : Math.round((completed / total) * 100),
  };
}
