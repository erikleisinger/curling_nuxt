import {useUserStore} from '@/store/user'
export const useTime = () => {

    const toTimezone = (date: string, format:string = 'MMMM D, YYYY h:mm A', toISO = false, raw = false) => {
        const dayjs = useDayjs()
        const store = useUserStore();
        const timezone = store.timezone;
        let parsed;
        if (typeof date === 'number') {
            parsed = dayjs.unix(date).utc(date ?? dayjs()).tz(timezone)
        } else {
            parsed = dayjs.utc(date ?? dayjs()).tz(timezone)
        }
     
        if (raw) return parsed;
        if (toISO) {
            return parsed.toISOString();
        } else {
            return parsed.format(format)
        }
    }
    const toUTC = (date:string, format:string = 'MMMM D, YYYY h:mm A', toISO = false, raw = false) => {
        const dayjs = useDayjs()
        const store = useUserStore();
        const timezone = store.timezone;
     
        let parsed;
        if (typeof date === 'number') {
            parsed = dayjs.unix(date).utc(date ?? dayjs()).tz(timezone)
        } else {
            parsed = dayjs.tz(date ?? dayjs(), timezone).utc();
        }
        if (raw) return parsed;
        if (toISO) {
            return parsed.toISOString();
        } else {
            return parsed.format(format)
        }
    }

    const format = (date:string, format:string = 'MMMM D, YYYY [at] h:mm A') => {
        const dayjs = useDayjs()
        return dayjs(date).format(format)
    }
    return {format, toTimezone, toUTC}
}