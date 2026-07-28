export default function ExamplesRenderer({ examples = [] }) {
  if (!examples.length) return null;

  return (
    <section>
      <h2>Examples</h2>
      <ul>
        {examples.map((example, index) => (
          <li key={index}>{example}</li>
        ))}
      </ul>
    </section>
  );
}