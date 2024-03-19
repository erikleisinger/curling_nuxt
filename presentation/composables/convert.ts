
export const useConvert = () => {

    const getShotPercent = (score: number | null) => {
        if (!score) return 0;
        const percent = (score / 4) * 100;
        return Number(percent.toFixed());
    };

    const getStatPercent = (numerator: number | null, denominator:number | null, decimals: number = 1) => {
        if (numerator === null || !denominator) return 0;
        return Number.parseInt(((numerator / denominator) * 100).toFixed(decimals))
    }
    


    return {getShotPercent, getStatPercent}
    
}