function toEmbedUrl(url) {
  const match = String(url || "").match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/
  );

  if (match) return `https://www.youtube.com/embed/${match[1]}`;

  return url;
}

function Video({ videos }) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="video-list">
      <h2>🎥 Videos</h2>

      {videos
        .filter((video) => video && video.url)
        .map((video, index) => (
        <div key={index} className="card video-item">
          {video.title && <h3>{video.title}</h3>}

          <div className="video-frame">
            <iframe
              src={toEmbedUrl(video.url)}
              title={video.title || `Video ${index + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {video.description && <p>{video.description}</p>}
        </div>
      ))}
    </div>
  );
}

export default Video;
