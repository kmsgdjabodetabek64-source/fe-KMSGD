import { useState } from "react";

export function useShowMore<T>(items: T[], limit = 6) {
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, limit);
  const hasMore = items.length > limit;

  return {
    visibleItems,
    showAll,
    hasMore,
    toggle: () => setShowAll((prev) => !prev),
  };
}
