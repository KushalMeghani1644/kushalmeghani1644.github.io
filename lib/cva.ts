import { cn } from "./utils"

import type { ClassValue } from "./utils"

type VariantProps<TFunc extends (...args: Array<never>) => string> =
  Parameters<TFunc>[0]

type VariantsConfig = Record<string, Record<string, string>>

type VariantOptions<TVariants extends VariantsConfig> = {
  [K in keyof TVariants]?: keyof TVariants[K]
}

type CVAConfig<TVariants extends VariantsConfig> = {
  variants?: TVariants
  defaultVariants?: VariantOptions<TVariants>
}

function cva<TVariants extends VariantsConfig>(
  base: string,
  config?: CVAConfig<TVariants>,
) {
  return (
    props?: VariantOptions<TVariants> & { className?: ClassValue },
  ): string => {
    const { className, ...variantProps } = props || {}
    const classes: Array<string> = [base]

    if (config?.variants) {
      const variants = config.variants
      const variantKeys = Object.keys(variants) as Array<keyof TVariants>

      for (const variantKey of variantKeys) {
        const variantValues = variants[variantKey]
        const selectedVariant =
          (variantProps as Record<string, string | undefined>)[
            variantKey as string
          ] ?? config.defaultVariants?.[variantKey]

        if (
          selectedVariant &&
          typeof selectedVariant === "string" &&
          variantValues[selectedVariant]
        ) {
          classes.push(variantValues[selectedVariant])
        }
      }
    }

    return cn(classes.join(" "), className)
  }
}

export { cva, type VariantProps }
