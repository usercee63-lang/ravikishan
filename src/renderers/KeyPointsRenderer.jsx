export default function KeyPointsRenderer({ keyPoints = [] }) {
  if (!keyPoints.length) return null;

  return (
    <section>
      <h2>Key Points</h2>
      <ul>
        {keyPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
