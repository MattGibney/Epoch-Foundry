const FNV_OFFSET_BASIS = 0x811c9dc5
const FNV_PRIME = 0x01000193

export function hashStringToUint32(input: string): number {
  let hash = FNV_OFFSET_BASIS

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, FNV_PRIME)
  }

  return hash >>> 0
}

export function getSeededUnitInterval(seed: string, salt: string): number {
  const hash = hashStringToUint32(`${seed}:${salt}`)
  return hash / 0xffffffff
}
