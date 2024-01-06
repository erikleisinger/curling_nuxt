export const useColor = () => {
    const getColor = (key: string) => {
        return {
            slate: '#283044',
            yellow: "#f6ae2d",
            blue: "#347fc4",
            red: "#ed254e",
            mint: '#00C49A',
            purple: "#ab47bc",
            pink: "#f06292",
            deepPurple: "#673ab7",
            green: "#2e7d32",
            lightGreen: "#66bb6a",
            deepGreen: "#1b5e20",
            indigo: "#3949ab",
            amber: "#ffc107",
            orange: "#ff5722",
            deepOrange: "#d84315",
            teal: "#4db6ac",
            primary: "#1976D2",
            secondary: "#26A69A",
            accent: "#9C27B0",
            positive: "#21BA45",
            negative: "#C10015",
            'blue-grey': '#607d8b',
        }[key];
    };

    const bgColors = {
        default: {
            r: 248,
            g: 248,
            b: 248
        },
        blue: {
            r: 204,
            g: 226,
            b: 255,
        },
        cyan: {
            r: 204,
            g: 252,
            b: 255
        },
        paleGreen: {
            r: 186,
            g: 255,
            b: 210
        },
        orange: {
            r: 255,
            g: 229,
            b: 186,
        },
        pink: {
            r: 254,
            g: 204,
            b: 255,
        },
        purple: {
            r: 211,
            g: 204,
            b: 255,
        },
        red: {
            r: 255,
            g: 204,
            b: 204
        },
        yellow: {
            r: 255,
            g: 248,
            b: 120
        }
    }

    const getEventColor = (color) => {
        const {r, g, b} = bgColors[color || 'default'] || {};
        return `${r}, ${g}, ${b}`;
    }

    const getEventBackground = (color, height = '1440') => {
        const {r, g, b} = bgColors[color || 'default'] || {};
        if (!r || !g || !b) return '';
        return `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='${height * 3}' height='${height}' preserveAspectRatio='none' viewBox='0 0 1440 250'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1021%26quot%3b)' fill='none'%3e%3crect width='1440' height='250' x='0' y='0' fill='rgba(${r}%2c ${g}%2c ${b}%2c 1)'%3e%3c/rect%3e%3cpath d='M36 250L286 0L557.5 0L307.5 250z' fill='url(%26quot%3b%23SvgjsLinearGradient1022%26quot%3b)'%3e%3c/path%3e%3cpath d='M239.60000000000002 250L489.6 0L689.1 0L439.1 250z' fill='url(%26quot%3b%23SvgjsLinearGradient1022%26quot%3b)'%3e%3c/path%3e%3cpath d='M477.20000000000005 250L727.2 0L776.7 0L526.7 250z' fill='url(%26quot%3b%23SvgjsLinearGradient1022%26quot%3b)'%3e%3c/path%3e%3cpath d='M722.8000000000001 250L972.8000000000001 0L1100.3000000000002 0L850.3000000000001 250z' fill='url(%26quot%3b%23SvgjsLinearGradient1022%26quot%3b)'%3e%3c/path%3e%3cpath d='M1435 250L1185 0L832.5 0L1082.5 250z' fill='url(%26quot%3b%23SvgjsLinearGradient1023%26quot%3b)'%3e%3c/path%3e%3cpath d='M1187.4 250L937.4000000000001 0L589.4000000000001 0L839.4000000000001 250z' fill='url(%26quot%3b%23SvgjsLinearGradient1023%26quot%3b)'%3e%3c/path%3e%3cpath d='M929.8 250L679.8 0L481.79999999999995 0L731.8 250z' fill='url(%26quot%3b%23SvgjsLinearGradient1023%26quot%3b)'%3e%3c/path%3e%3cpath d='M705.1999999999999 250L455.19999999999993 0L314.19999999999993 0L564.1999999999999 250z' fill='url(%26quot%3b%23SvgjsLinearGradient1023%26quot%3b)'%3e%3c/path%3e%3cpath d='M1248.9524112383724 250L1440 58.95241123837249L1440 250z' fill='url(%26quot%3b%23SvgjsLinearGradient1022%26quot%3b)'%3e%3c/path%3e%3cpath d='M0 250L191.0475887616275 250L 0 58.95241123837249z' fill='url(%26quot%3b%23SvgjsLinearGradient1023%26quot%3b)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1021'%3e%3crect width='1440' height='250' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='0%25' y1='100%25' x2='100%25' y2='0%25' id='SvgjsLinearGradient1022'%3e%3cstop stop-color='rgba(0%2c 0%2c 0%2c 0.04)' offset='0'%3e%3c/stop%3e%3cstop stop-opacity='0' stop-color='rgba(0%2c 0%2c 0%2c 0.04)' offset='0.66'%3e%3c/stop%3e%3c/linearGradient%3e%3clinearGradient x1='100%25' y1='100%25' x2='0%25' y2='0%25' id='SvgjsLinearGradient1023'%3e%3cstop stop-color='rgba(0%2c 0%2c 0%2c 0.04)' offset='0'%3e%3c/stop%3e%3cstop stop-opacity='0' stop-color='rgba(0%2c 0%2c 0%2c 0.04)' offset='0.66'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e")`;
    };

    
function getGradient(ctx, chartArea, color) {
    let gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
    );
    gradient.addColorStop(1, color);
    gradient.addColorStop(0.7, `${color}b3`);
    gradient.addColorStop(0.5, `${color}80`);
    gradient.addColorStop(0, `${color}00`);
    return gradient;
}
    const setBgGradient = (context, color) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
    
        // This case happens on initial chart load
        if (!chartArea) return;
        return getGradient(ctx, chartArea, color);
    };
    return { getColor, getEventBackground, getEventColor, setBgGradient };
};
