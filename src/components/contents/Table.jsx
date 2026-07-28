function Table({ tables }) {
  if (!tables?.length) return null;

  return (
    <>
      {tables.map((table, index) => (
        <section
          key={index}
          className="content-section"
        >
          {table.title && <h3>{table.title}</h3>}

          <table>
            <thead>
              <tr>
                {table.headers.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </>
  );
}

export default Table;