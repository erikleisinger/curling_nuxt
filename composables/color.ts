export const useColor = () => {
    const getColor = (key: string) => {
        return {
            yellow: '#ffec3d',
            blue: '#3790e9',
            red: '#e53734',
            purple: '#ab47bc',
            pink: '#f06292',
            deepPurple: '#7e57c2',
            green: '#2e7d32',
            lightGreen: '#66bb6a',
            deepGreen: '#1b5e20',
            indigo: '#3949ab',
            amber: '#ffc107',
            orange: '#ff5722',
            teal: '#4db6ac',
            primary: '#1976D2',
            secondary: '#26A69A',
            accent: '#9C27B0',
            positive: '#21BA45',
            negative: '#C10015',
        }[key]
    }  
    return {getColor} 
}