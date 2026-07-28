function Image({ images }) {
  if (!images?.length) return null;

  return (
    <section className="content-section">
      <h3>Images</h3>

      {images.map((image, index) => (
        <figure key={index}>
          <img
            src={image.src}
            alt={image.alt || ""}
            className="content-image"
          />

          {image.caption && (
            <figcaption>{image.caption}</figcaption>
          )}
        </figure>
      ))}
    </section>
  );
}

export default Image;
