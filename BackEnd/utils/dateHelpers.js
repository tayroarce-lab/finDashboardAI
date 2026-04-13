/**
 * Helpers para manejo de rangos de fecha en KPIs y reportes.
 */

/**
 * Obtiene el rango de fechas para un período dado.
 * @param {'today'|'week'|'month'|'quarter'|'year'} period
 * @returns {{ startDate: string, endDate: string, prevStartDate: string, prevEndDate: string }}
 */
function getDateRange(period = 'month') {
    const now = new Date();
    let startDate, endDate, prevStartDate, prevEndDate;

    switch (period) {
        case 'today':
            startDate = formatDate(now);
            endDate = formatDate(now);
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            prevStartDate = formatDate(yesterday);
            prevEndDate = formatDate(yesterday);
            break;

        case 'week':
            const dayOfWeek = now.getDay() || 7; // Lunes = 1
            const monday = new Date(now);
            monday.setDate(now.getDate() - dayOfWeek + 1);
            startDate = formatDate(monday);
            endDate = formatDate(now);

            const prevMonday = new Date(monday);
            prevMonday.setDate(prevMonday.getDate() - 7);
            const prevSunday = new Date(monday);
            prevSunday.setDate(prevSunday.getDate() - 1);
            prevStartDate = formatDate(prevMonday);
            prevEndDate = formatDate(prevSunday);
            break;

        case 'month':
            startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
            endDate = formatDate(now);

            const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            prevStartDate = formatDate(prevMonth);
            prevEndDate = formatDate(prevMonthEnd);
            break;

        case 'quarter':
            const quarter = Math.floor(now.getMonth() / 3);
            const qStart = new Date(now.getFullYear(), quarter * 3, 1);
            startDate = formatDate(qStart);
            endDate = formatDate(now);

            const prevQStart = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
            const prevQEnd = new Date(now.getFullYear(), quarter * 3, 0);
            prevStartDate = formatDate(prevQStart);
            prevEndDate = formatDate(prevQEnd);
            break;

        case 'year':
            startDate = `${now.getFullYear()}-01-01`;
            endDate = formatDate(now);
            prevStartDate = `${now.getFullYear() - 1}-01-01`;
            prevEndDate = `${now.getFullYear() - 1}-12-31`;
            break;

        default:
            return getDateRange('month');
    }

    return { startDate, endDate, prevStartDate, prevEndDate };
}

/**
 * Formatea una fecha a YYYY-MM-DD.
 */
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Calcula el porcentaje de cambio entre dos valores.
 */
function percentChange(current, previous) {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return parseFloat(((current - previous) / previous * 100).toFixed(1));
}

module.exports = { getDateRange, formatDate, percentChange };
