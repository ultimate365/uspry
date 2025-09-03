import React, { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";

/** Debounce hook */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Highlight matched text */
function HighlightMatch({ text, matches }) {
  if (!text || !matches || matches.length === 0) return <>{text}</>;

  const raw = matches.flatMap((m) => m.indices || []);
  if (raw.length === 0) return <>{text}</>;

  const sorted = raw.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [s, e] of sorted) {
    if (!merged.length || s > merged[merged.length - 1][1] + 1) {
      merged.push([s, e]);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
    }
  }

  const parts = [];
  let last = 0;
  merged.forEach(([s, e], i) => {
    if (last < s) parts.push(text.slice(last, s));
    parts.push(<mark key={`${s}-${e}`}>{text.slice(s, e + 1)}</mark>);
    last = e + 1;
  });
  if (last < text.length) parts.push(text.slice(last));

  return <>{parts}</>;
}

/**
 * Reusable FuzzySearch Component
 */
export default function FuzzySearch({
  data,
  keys,
  placeholder = "Search...",
  renderItem,
  threshold = 0.5,
  limit,
  inputProps = {},
  onItemClick = () => {}, // ✅ default no-op
}) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 300);

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys,
        threshold,
        includeMatches: true,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [data, keys, threshold]
  );

  const results = useMemo(() => {
    if (!debounced) return data.map((item) => ({ item }));
    const found = fuse.search(debounced);
    return typeof limit === "number" ? found.slice(0, limit) : found;
  }, [debounced, fuse, data, limit]);

  return (
    <div className="mb-3 position-relative col-md-6 col-lg-4 mx-auto">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          {...inputProps}
        />
        <button
          className="btn btn-warning"
          type="button"
          id="button-addon1"
          onClick={() => setQuery("")}
        >
          Clear
        </button>
      </div>
      {query.length
        ? results.length > 0 && (
            <ul
              className="list-group position-absolute w-100"
              style={{ zIndex: 1000, maxHeight: "250px", overflowY: "auto" }}
            >
              {results.map((res, idx) => {
                const matchesForKey = (key) =>
                  res.matches?.filter((m) => m.key === key) || [];

                return (
                  <li
                    key={idx}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => onItemClick(res.item)} // ✅ trigger parent handler
                  >
                    {renderItem({
                      item: res.item,
                      matchesForKey,
                      HighlightMatch,
                    })}
                  </li>
                );
              })}
            </ul>
          )
        : null}
    </div>
  );
}
