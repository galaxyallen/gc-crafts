/** next/image: skip optimizer for data URLs and private Blob proxy paths */
export function isDataUrl(src: string) {
  return src.startsWith("data:");
}

export function isUnoptimizedImage(src: string) {
  return isDataUrl(src) || src.startsWith("/api/media");
}
