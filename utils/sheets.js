export const numberToLetter = (num) => {
    try {
        return String.fromCharCode(97 + num - 1).toUpperCase()
    } catch {
        return 'N/A'
    }

}