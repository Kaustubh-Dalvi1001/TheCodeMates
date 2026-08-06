// BadgeList.jsx
import { useState } from "react";

const BATCH_SIZE = 5;

const BadgeList = ({ items, colorClass, emptyText }) => {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  if (!items || items.length === 0) {
    return emptyText ? (
      <span className="text-sm text-base-content/50">{emptyText}</span>
    ) : null;
  }

  const remainingCount = items.length - visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  return (
    <div className="flex flex-wrap gap-1">
      {items.slice(0, visibleCount).map((item) => (
        <div key={item} className="tooltip tooltip-bottom" data-tip={item}>
          <span
            className={`badge ${colorClass} badge-outline max-w-[8rem] truncate justify-start px-3`}
          >
            {item}
          </span>
        </div>
      ))}

      {remainingCount > 0 && (
        <span
          onClick={handleShowMore}
          className="badge badge-ghost cursor-pointer hover:badge-neutral"
        >
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};

export default BadgeList;