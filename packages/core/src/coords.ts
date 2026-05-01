const ALPHABET_SIZE = 26
const CHAR_CODE_A = 65

export const indexToLabel = (n: number): string => {
  if (n < ALPHABET_SIZE) {
    return String.fromCharCode(CHAR_CODE_A + n)
  }
  return (
    indexToLabel(Math.floor((n - ALPHABET_SIZE) / ALPHABET_SIZE)) +
    String.fromCharCode(CHAR_CODE_A + ((n - ALPHABET_SIZE) % ALPHABET_SIZE))
  )
}

export const labelToIndex = (label: string): number => {
  let result = 0
  for (let i = 0; i < label.length; i++) {
    result = result * ALPHABET_SIZE + (label.charCodeAt(i) - CHAR_CODE_A + 1)
  }
  return result - 1
}
