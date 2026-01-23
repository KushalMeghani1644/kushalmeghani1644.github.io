import { twMerge } from "tailwind-merge"

type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  const flatten = (arr: ClassValue[]): string[] => {
    const result: string[] = []
    for (const item of arr) {
      if (Array.isArray(item)) {
        result.push(...flatten(item))
      } else if (typeof item === "string" && item !== "") {
        result.push(item)
      } else if (typeof item === "number") {
        result.push(String(item))
      }
    }
    return result
  }
  return twMerge(flatten(inputs).join(" "))
}
