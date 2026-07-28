export default function FormulaRenderer({ formulas = [] }) {
  if (!formulas.length) return null;

  return (
    <section>
      <h2>Formulas</h2>
      <ul>
        {formulas.map((formula, index) => (
          <li key={index}>{formula}</li>
        ))}
      </ul>
    </section>
  );
}