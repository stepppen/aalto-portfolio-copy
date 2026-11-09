import sizes from '~/assets/image-sizes.json'

/** CSS aspect-ratio for an image in public/, from the build-time size manifest. */
export function imageRatio(src?: string): string | undefined {
  const s = src ? (sizes as Record<string, [number, number]>)[src] : undefined
  return s ? `${s[0]} / ${s[1]}` : undefined
}
