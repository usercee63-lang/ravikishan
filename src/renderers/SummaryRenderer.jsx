export default function SummaryRenderer({ summary }) {
  if (!summary) return null;

  return (
    <section>
      <h2>Summary</h2>
      <p>{summary}</p>
    </section>
  );
}