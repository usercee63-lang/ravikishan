export default function DiagramRenderer({ diagrams = [] }) {
  if (!diagrams.length) return null;

  return (
    <section>
      <h2>Diagrams</h2>
      <ul>
        {diagrams.map((diagram, index) => (
          <li key={index}>{diagram}</li>
        ))}
      </ul>
    </section>
  );
}