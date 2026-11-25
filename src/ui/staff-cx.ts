/** Joins class names, skipping falsy ones. No merging: components keep their own classes separate from callers'. */
export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ")
}

/** For `.filter(present)`: drops false, null and undefined with a type the compiler keeps. */
export function present<T>(value: T | false | null | undefined | 0 | ""): value is T {
  return !!value
}
