import { useState } from "react";

function normalize(node) {
  if (typeof node === "string") {
    return { title: node, children: [], details: "" };
  }

  return {
    title: node?.title || node?.label || "Node",
    children: node?.children || [],
    details: node?.details || "",
  };
}

function MindMapNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(true);

  const { title, children, details } = normalize(node);
  const hasChildren = children.length > 0;

  return (
    <div className="mindmap-node-wrap">
      <div className="mindmap-node" style={{ "--depth": depth }}>
        {hasChildren && (
          <button
            className="mindmap-toggle"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? "−" : "+"}
          </button>
        )}

        <span className="mindmap-title">{title}</span>

        {details && <p className="mindmap-details">{details}</p>}
      </div>

      {hasChildren && open && (
        <div className="mindmap-children">
          {children.map((child, index) => (
            <MindMapNode key={index} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function MindMap({ mindmap }) {
  if (!mindmap) return null;

  if (Array.isArray(mindmap) && mindmap.length === 0) {
    return <p>🚧 Mind map not available yet.</p>;
  }

  if (Array.isArray(mindmap)) {

    return (
      <div className="mindmap">
        <h2>🧠 Mind Map</h2>

        {mindmap.map((node, index) => (
          <MindMapNode key={index} node={node} />
        ))}
      </div>
    );
  }

  if (mindmap.nodes) {
    return (
      <div className="mindmap">
        <h2>🧠 Mind Map</h2>

        {mindmap.nodes.map((node, index) => (
          <MindMapNode key={index} node={node} />
        ))}
      </div>
    );
  }

  return (
    <div className="mindmap">
      <h2>🧠 Mind Map</h2>

      <MindMapNode node={mindmap} />
    </div>
  );
}

export default MindMap;
