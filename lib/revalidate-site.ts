import { revalidatePath } from "next/cache";

/** Bust ISR cache after admin CMS / catalog updates. */
export function revalidatePublicSite(paths?: string[]) {
  const targets = paths ?? [
    "/",
    "/oem",
    "/contact",
    "/displays",
    "/trays",
    "/busts",
    "/watches",
  ];

  for (const path of targets) {
    revalidatePath(path);
  }
}
