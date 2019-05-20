export function isLength(input, min, max) {
    if (!typeof input === 'string') {
        return false
    }
    return input.trim().length <= max && input.trim().length >= min
}

export function hasLetters(input) {
    const letters = /[A-Za-z]/
    return input.match(letters)
}

export function hasNumbers(input) {
    const numbers = /[0-9]/
    return input.match(numbers)
}

export default (input) => isLength(input, 6, 30) && hasLetters(input) && hasNumbers(input)