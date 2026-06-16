/** Use unoptimized next/image for inline data URLs only */
export function isDataUrl(src: string) {
  return src.startsWith("data:");
}
