import {useUserStore} from '@/store/user'
export const useTime = () => {

    const toTimezone = (date: string, format:string = 'MMMM D, YYYY h:mm A') => {
        const dayjs = useDayjs()
        const store = useUserStore();
        const timezone = store.timezone;
        return dayjs.utc(date).tz(timezone).format(format)
    }
    const toUTC = (date:string, format:string = 'MMMM D, YYYY h:mm A', toISO = false) => {
        const dayjs = useDayjs()
        const store = useUserStore();
        const timezone = store.timezone;
        const parsed = dayjs.tz(date, timezone).utc();
        if (toISO) {
            return parsed.toISOString();
        } else {
            return parsed.format(format)
        }
    }
    return {toTimezone, toUTC}
}