export default function PracticeRenderer({ practice = [] }) {
  if (!practice.length) return null;

  return (
    <section>
      <h2>Practice Questions</h2>

      {practice.map((item, index) => (
        <div key={index}>
          <p><strong>Q:</strong> {item.question}</p>
          <p><strong>A:</strong> {item.answer}</p>
        </div>
      ))}
    </section>
  );
}