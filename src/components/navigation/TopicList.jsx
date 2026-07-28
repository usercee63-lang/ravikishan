export default function TopicList({ topics, onSelect }) {
  if (!topics || topics.length === 0) {
    return <p>No topics available.</p>;
  }

  return (
    <div>
      <h2>Topics</h2>

      {topics.map((topic) => (
        <button
          key={topic.id || topic.name}
          onClick={() => onSelect(topic)}
        >
          {topic.name}
        </button>
      ))}
    </div>
  );
}