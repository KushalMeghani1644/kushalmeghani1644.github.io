type ClassValue = string | undefined | null | false

type VariantProps<T extends (...args: never[]) => string> = Parameters<T>[0]

type VariantsConfig = Record<string, Record<string, string>>

type VariantOptions<V extends VariantsConfig> = {
  [K in keyof V]?: keyof V[K]
}

type CVAConfig<V extends VariantsConfig> = {
  variants?: V
  defaultVariants?: VariantOptions<V>
}

function cva<V extends VariantsConfig>(
  base: string,
  config?: CVAConfig<V>
) {
  return (props?: VariantOptions<V> & { className?: ClassValue }): string => {
    const { className, ...variantProps } = props || {}
    const classes: string[] = [base]

    if (config?.variants) {
      const variants = config.variants
      const variantKeys = Object.keys(variants) as (keyof V)[]

      for (const variantKey of variantKeys) {
        const variantValues = variants[variantKey]
        const selectedVariant =
          (variantProps as Record<string, string | undefined>)[variantKey as string] ??
          config.defaultVariants?.[variantKey]

        if (selectedVariant && typeof selectedVariant === 'string' && variantValues[selectedVariant]) {
          classes.push(variantValues[selectedVariant])
        }
      }
    }

    if (className) {
      classes.push(className)
    }

    return classes.filter(Boolean).join(" ")
  }
}

export { cva, type VariantProps }
