export async function readApiError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  const message = typeof data.error === "string" ? data.error : fallback;

  if (res.status === 401) {
    return "Session expired — please log out and log in again.";
  }
  if (res.status === 405) {
    return "Save blocked by server (HTTP 405). Please redeploy the latest version.";
  }

  if (message === fallback && res.status >= 400) {
    return `${fallback} (HTTP ${res.status})`;
  }

  return message;
}
