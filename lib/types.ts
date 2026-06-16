export type ProductCategory = "DISPLAYS" | "TRAYS" | "BUSTS" | "WATCHES";
export type InquiryStatus = "NEW" | "REPLIED" | "CLOSED";

export const PRODUCT_CATEGORIES: ProductCategory[] = ["DISPLAYS", "TRAYS", "BUSTS", "WATCHES"];
export const INQUIRY_STATUSES: InquiryStatus[] = ["NEW", "REPLIED", "CLOSED"];

export const CATEGORY_ROUTES: Record<ProductCategory, string> = {
  DISPLAYS: "/displays",
  TRAYS: "/trays",
  BUSTS: "/busts",
  WATCHES: "/watches",
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  DISPLAYS: "Jewelry Displays",
  TRAYS: "Jewelry Trays",
  BUSTS: "Necklace Busts",
  WATCHES: "Watch Displays",
};
