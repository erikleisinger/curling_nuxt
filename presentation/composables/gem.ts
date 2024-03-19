export const useGem = () => {
    function calculateGemShades(baseColor: string) {
        // Convert hexadecimal color to RGB
        function hexToRgb(hex) {
            return {
                r: parseInt(hex.substring(1, 3), 16),
                g: parseInt(hex.substring(3, 5), 16),
                b: parseInt(hex.substring(5, 7), 16)
            };
        }
    
        // Convert RGB to hexadecimal color
        function rgbToHex(rgb) {
            return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
        }
    
        // Calculate lighter shade
        function lightenColor(color) {
            const lightnessFactor = 0.3; // Adjust the factor to control the lightness
            const rgb = hexToRgb(color);
            const newRgb = {
                r: Math.min(Math.round(rgb.r * (1 + lightnessFactor)), 255),
                g: Math.min(Math.round(rgb.g * (1 + lightnessFactor)), 255),
                b: Math.min(Math.round(rgb.b * (1 + lightnessFactor)), 255)
            };
            return rgbToHex(newRgb);
        }
    
        // Calculate darker shade
        function darkenColor(color) {
            const darknessFactor = 0.3; // Adjust the factor to control the darkness
            const rgb = hexToRgb(color);
            const newRgb = {
                r: Math.max(Math.round(rgb.r * (1 - darknessFactor)), 0),
                g: Math.max(Math.round(rgb.g * (1 - darknessFactor)), 0),
                b: Math.max(Math.round(rgb.b * (1 - darknessFactor)), 0)
            };
            return rgbToHex(newRgb);
        }
    
        const lightColor = lightenColor(baseColor);
        const darkColor = darkenColor(baseColor);
    
        return {
            base: baseColor,
            light: lightColor,
            dark: darkColor
        };
    }
    return {calculateGemShades}
}