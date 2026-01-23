import { twMerge } from "tailwind-merge"

export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | Array<ClassValue>

export function cn(...inputs: Array<ClassValue>): string {
  const flatten = (arr: Array<ClassValue>): Array<string> => {
    const result: Array<string> = []
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
