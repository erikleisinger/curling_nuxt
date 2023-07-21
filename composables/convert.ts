
export const useConvert = () => {

    const getPercent = (score: number | null) => {
        if (!score) return 0;
        const percent = (score / 4) * 100;
        return Number(percent.toFixed());
    };
    


    return {getPercent}
    
}