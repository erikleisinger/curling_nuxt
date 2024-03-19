export const useUniqueId = () => {
    const generateUniqueId = (prefix) => {
        return `${prefix}${prefix ? '-' : ''}${(Math.random() * 1000000000000).toFixed()}`;
    }
    return {generateUniqueId}
}