function ProgressButton({ status, updateStatus }) {
  return (
    <div className="progress-actions">
      <button onClick={() => updateStatus("completed")}>
        {status === "completed"
          ? "✅ Completed"
          : "✔ Mark as Completed"}
      </button>
    </div>
  );
}

export default ProgressButton;
