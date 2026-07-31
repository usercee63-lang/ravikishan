function Numerical({ numericals }) {
  if (!numericals || numericals.length === 0) {
    return <p>🚧 This section is coming soon 🚀</p>;
  }

  return (
    <div className="numericals-list">
      <h2>🧮 Numericals</h2>

      {numericals.map((item, index) => (
        <div key={index} className="card">
          <h3>Question {index + 1}</h3>

          <p>{item.question}</p>

          <h4>Solution</h4>

          <ol>
            {item.solution?.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          <strong>Answer: {item.answer}</strong>
        </div>
      ))}
    </div>
  );
}

export default Numerical;
