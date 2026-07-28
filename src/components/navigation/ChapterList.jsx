export default function ChapterList({ chapters, onSelect }) {
  if (!chapters || chapters.length === 0) {
    return <p>No chapters available.</p>;
  }

  return (
    <div>
      <h2>Chapters</h2>

      {chapters.map((chapter) => (
        <button
          key={chapter.id || chapter.name}
          onClick={() => onSelect(chapter)}
        >
          {chapter.name}
        </button>
      ))}
    </div>
  );
}