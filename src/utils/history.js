const KEY = "study-history";

export function saveHistory(item) {
  const history = getHistory();

  const filtered = history.filter(
    (h) =>
      !(
        h.subject === item.subject &&
        h.chapter === item.chapter &&
        h.topic === item.topic
      )
  );

  filtered.unshift({
    ...item,
    visitedAt: Date.now(),
  });

  localStorage.setItem(
    KEY,
    JSON.stringify(filtered.slice(0, 20))
  );
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function getLastTopic() {
  return getHistory()[0] || null;
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
