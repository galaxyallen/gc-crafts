/** Turn CMS title text into hero heading (comma or newline → line break + emphasis). */
export function CmsTitle({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length >= 2) {
    return (
      <>
        {lines[0]}
        <br />
        <em>{lines.slice(1).join(" ")}</em>
      </>
    );
  }

  const comma = text.indexOf(",");
  if (comma > 0 && comma < text.length - 1) {
    return (
      <>
        {text.slice(0, comma + 1)}
        <br />
        <em>{text.slice(comma + 1).trim()}</em>
      </>
    );
  }

  return <>{text}</>;
}
