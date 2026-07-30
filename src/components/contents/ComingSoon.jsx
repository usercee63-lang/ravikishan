function ComingSoon({ title }) {
  return (
    <div
      style={{
        marginTop: 25,
        padding: 30,
        textAlign: "center",
        borderRadius: 16,
        border: "1px dashed #cbd5e1",
        background: "#f8fafc",
      }}
    >
      <h3>{title}</h3>

      <p
        style={{
          marginTop: 10,
          color: "#64748b",
        }}
      >
        🚧 This section is coming soon 🚀
      </p>
    </div>
  );
}

export default ComingSoon;
