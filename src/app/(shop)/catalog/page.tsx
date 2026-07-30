import { permanentRedirect } from "next/navigation";

/**
 * /catalog duplicated /shop with its own divergent product list and expired image
 * URLs. Kept as a permanent redirect so existing links and any search listings
 * land on the real shop rather than 404.
 */
export default function CatalogPage(): never {
  permanentRedirect("/shop");
}
