import { twMerge } from "tailwind-merge"

type ClassValue = string | undefined | null | false | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  const flatten = (arr: ClassValue[]): string[] => {
    const result: string[] = []
    for (const item of arr) {
      if (Array.isArray(item)) {
        result.push(...flatten(item))
      } else if (item) {
        result.push(item)
      }
    }
    return result
  }
  return twMerge(flatten(inputs).join(" "))
}
