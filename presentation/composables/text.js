export const useText = () => {
    const truncateWords = (name, maxLength = 10) => {
        const words = name?.split(' ') ?? [];
        if (!words.length) return null;
        let htmlStr = ``;
        words.forEach((word) => {
            htmlStr = `${htmlStr} <span style="${word.length > maxLength ? 'word-break: break-word' : ''}; width: fit-content">${word} </span>
            `
        })
        return htmlStr
    }

    return { truncateWords };
};
