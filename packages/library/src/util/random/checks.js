export const maxRunLength = (arr) => {
  // Given an array, compute the longest consecutive
  // sequence of identical elements
  if (arr.length === 0) return 0

  let longestSequenceLength = 1
  let currentSequenceLength = 1

  for (let i = 0; i < arr.length; i++) {
    if (currentSequenceLength > longestSequenceLength) {
      longestSequenceLength = currentSequenceLength
    }

    if (arr[i] === arr[i+1]) {
      currentSequenceLength++
    } else {
      currentSequenceLength = 1
    }
  }

  return longestSequenceLength
}

/*
  TODO: Automate checking of private helper functions
  const testCases = [
    [[1, 2, 3], 1],
    [[1, 2, 3, 3], 2],
    [[1, 1, 2, 3], 2],
    [[1, 2, 2, 3], 2],
    [[1, 1, 2, 2, 2, 3, 4, 4, 4], 3],
    [[], 0]
  ]
*/

export const minDistance = (arr) => {
  // Given an array, compute the minimum distance
  // between two identical elements
  if (arr.length === 0) return undefined

  const lastPositions = {}
  let minDistance = Infinity

  for (let i = 0; i < arr.length; i++) {
    const candidate = arr[i]

    if (lastPositions[candidate] !== undefined) {
      const distance = i - lastPositions[candidate]
      if (minDistance > distance) {
        minDistance = distance
      }
    }

    lastPositions[candidate] = i
  }

  return minDistance
}

/*
  const testCases = [
    [[1, 2, 3], Infinity],
    [[1, 1, 1, 1], 1],
    [[1, 1, 1, 1, 2, 1], 1],
    [[1, 2, 1, 1, 2, 1], 1],
    [[1, 1, 2, 3], 1],
    [[1, 2, 2, 3], 1],
    [[1, 2, 3, 3], 1],
    [[1, 2, 1, 3, 4], 2],
    [[1, 2, 3, 2, 4], 2],
    [[1, 2, 3, 4, 3], 2],
    [[], undefined]
  ]
*/