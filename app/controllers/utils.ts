
export const monthToString = (month: number) => {
    switch (month) {
        case 0: return "January"
        case 1: return "February"
        case 2: return "March"
        case 3: return "April"
        case 4: return "May"
        case 5: return "June"
        case 6: return "July"
        case 7: return "August"
        case 8: return "September"
        case 9: return "October"
        case 10: return "November"
        case 11: return "December"
        default: return ""
    };
}

export const dateToString = (date: Date) => {
    return `${monthToString(date.getMonth())} ${date.getDate()}, ${date.getFullYear()}`;
}

export function isThreeMonthsOld(dateToCheck: Date): boolean {
    const today = new Date();
    // Calculate the date 3 months ago
    const threeMonthsAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 3,
        today.getDate()
    );
    // Check if the given date is before or equal to the date 3 months ago
    return dateToCheck <= threeMonthsAgo;
}