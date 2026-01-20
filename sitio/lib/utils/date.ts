import { formatDistanceToNow, parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

const FORMAT_LONG = "EEEE, d 'de' MMMM 'de' yyyy h:mm a";
const FORMAT_SHORT = "d 'de' MMMM 'de' yyyy";

export const getDateDistance = (date: string) => {
    try {
        return formatDistanceToNow(parseISO(date), {
            addSuffix: true,
            locale: es,
        });
    } catch (e) {
        return "Hace poco";
    }
};

export const normalizeDate = (date: string | Date): string =>
    date instanceof Date ? date.toISOString() : date;

export const formatDate = (
    date: string | Date,
    formatType: "long" | "short" = "long"
) => {
    const dateString = date instanceof Date ? date.toISOString() : date;
    try {
        const parsedDate = parseISO(dateString);
        return format(parsedDate, formatType === "short" ? FORMAT_SHORT : FORMAT_LONG, { locale: es });
    } catch (e) {
        return dateString;
    }
};
export const getDisplayDate = (date: string | Date) => {
    const dateString = normalizeDate(date);
    try {
        const parsedDate = parseISO(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - parsedDate.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours < 24 && diffInHours >= 0) {
            const hours = Math.floor(diffInHours);
            if (hours === 0) {
                const minutes = Math.floor(diffInMs / (1000 * 60));
                return `Hace ${minutes} min`;
            }
            return `Hace ${hours} h`;
        }

        return formatDate(dateString, "short");
    } catch (e) {
        return dateString;
    }
};
