export async function readApiError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  const message = typeof data.error === "string" ? data.error : fallback;

  if (res.status === 401) {
    return "Session expired — please log in again.";
  }

  return message;
}
