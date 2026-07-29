export default function ReadingTime({ text = "" }) {
  const words = text.trim().split(/\s+/).length;

  const minutes = Math.max(
    1,
    Math.ceil(words / 200)
  );

  return (
    <p className="text-sm text-gray-500 mb-3">
      📖 {minutes} min read
    </p>
  );
}
