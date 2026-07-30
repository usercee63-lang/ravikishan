import "./ContentTabs.css";

function ContentTabs({
  activeTab,
  setActiveTab,
  tabs,
}) {
  return (
    <div className="content-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={
            activeTab === tab.id
              ? "tab-button active"
              : "tab-button"
          }
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
}

export default ContentTabs;
