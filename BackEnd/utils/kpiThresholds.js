/**
 * Umbrales semáforo para KPIs.
 * Cada KPI tiene rangos que determinan su color/estado.
 */

const KPI_THRESHOLDS = {
    margin: {
        green: { min: 35, label: 'Saludable' },
        yellow: { min: 20, max: 35, label: 'Atención' },
        red: { max: 20, label: 'Crítico' }
    },
    treatmentMargin: {
        green: { min: 40, label: 'Rentable' },
        yellow: { min: 15, max: 40, label: 'Aceptable' },
        red: { max: 15, label: 'No rentable' }
    },
    occupancy: {
        green: { min: 80, label: 'Óptima' },
        yellow: { min: 60, max: 80, label: 'Mejorable' },
        red: { max: 60, label: 'Baja' }
    },
    cancellationRate: {
        green: { max: 10, label: 'Normal' },
        yellow: { min: 10, max: 20, label: 'Atención' },
        red: { min: 20, label: 'Crítico' }
    },
    revenueChange: {
        green: { min: 0, label: 'Creciendo' },
        yellow: { min: -5, max: 0, label: 'Estable' },
        red: { max: -5, label: 'Cayendo' }
    },
    expenseChange: {
        green: { max: 0, label: 'Reduciendo' },
        yellow: { min: 0, max: 10, label: 'Estable' },
        red: { min: 10, label: 'Creciendo' }
    }
};

/**
 * Determina el estado semáforo para un KPI.
 * @param {string} kpiName - Nombre del KPI (ej: 'margin')
 * @param {number} value - Valor actual
 * @returns {{ status: 'green'|'yellow'|'red', label: string }}
 */
function getSemaphore(kpiName, value) {
    const thresholds = KPI_THRESHOLDS[kpiName];
    if (!thresholds) return { status: 'yellow', label: 'Sin umbral definido' };

    if (thresholds.green.min !== undefined && value >= thresholds.green.min) {
        return { status: 'green', label: thresholds.green.label };
    }
    if (thresholds.green.max !== undefined && value <= thresholds.green.max) {
        return { status: 'green', label: thresholds.green.label };
    }
    if (thresholds.red.max !== undefined && value < thresholds.red.max) {
        return { status: 'red', label: thresholds.red.label };
    }
    if (thresholds.red.min !== undefined && value >= thresholds.red.min) {
        return { status: 'red', label: thresholds.red.label };
    }
    return { status: 'yellow', label: thresholds.yellow.label };
}

module.exports = { KPI_THRESHOLDS, getSemaphore };
