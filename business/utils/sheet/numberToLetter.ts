export const numberToLetter  = (num:number): string  => {
    try {
        return String.fromCharCode(97 + num - 1).toUpperCase()
    } catch {
        return 'N/A'
    }

}