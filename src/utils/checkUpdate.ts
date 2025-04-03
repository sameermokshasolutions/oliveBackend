/**
 * Compares two objects and returns an array of changed property paths
 * @param existingData The original object
 * @param newData The updated object
 * @param options Configuration options
 * @returns Array of changed property paths
 */
export function checkUpdate<T extends Record<string, any>>(
  existingData: T,
  newData: Partial<T>,
  options: {
    ignoreFields?: string[];
    arrayComparison?: "shallow" | "deep";
  } = {}
): string[] {
  const changedProperties: Set<string> = new Set();
  const { ignoreFields = ["_id", "__v"], arrayComparison = "deep" } = options;

  /**
   * Recursively compares values and tracks changed paths
   */
  function deepCompare(oldValue: any, newValue: any, path: string) {
    // Skip ignored fields
    if (ignoreFields.some((field) => path.endsWith(field))) {
      return;
    }

    // Handle null/undefined cases
    if (oldValue == null || newValue == null) {
      if (oldValue !== newValue) {
        changedProperties.add(path);
      }
      return;
    }

    // Array comparison
    if (Array.isArray(oldValue)) {
      if (!Array.isArray(newValue)) {
        changedProperties.add(path);
        return;
      }

      if (arrayComparison === "deep") {
        if (!areArraysEqualDeep(oldValue, newValue)) {
          changedProperties.add(path);
        }
      } else {
        if (!areArraysEqualShallow(oldValue, newValue)) {
          changedProperties.add(path);
        }
      }
      return;
    }

    // Object comparison
    if (typeof oldValue === "object" && typeof newValue === "object") {
      Object.keys(newValue).forEach((key) => {
        deepCompare(oldValue[key], newValue[key], `${path}.${key}`);
      });
      return;
    }

    // Primitive value comparison
    if (oldValue !== newValue) {
      changedProperties.add(path);
    }
  }

  // Start comparison with top-level keys
  Object.keys(newData).forEach((key) => {
    deepCompare(existingData[key], newData[key], key);
  });

  return Array.from(changedProperties);
}

/**
 * Performs deep equality check for arrays
 */
function areArraysEqualDeep(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;

  const aSorted = [...a].sort();
  const bSorted = [...b].sort();

  return aSorted.every((item, index) => {
    if (typeof item === "object" && item !== null) {
      return JSON.stringify(item) === JSON.stringify(bSorted[index]);
    }
    return item === bSorted[index];
  });
}

/**
 * Performs shallow equality check for arrays
 */
function areArraysEqualShallow(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
}
