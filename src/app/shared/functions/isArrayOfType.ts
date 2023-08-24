export function isArrayOfType<T>(value: unknown, typeCheck: (item: unknown) => item is T): value is T[] {
    return Array.isArray(value) && value.every(typeCheck);
}