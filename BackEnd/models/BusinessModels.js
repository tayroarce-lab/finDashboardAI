class AppointmentModel {
    constructor(id, doctorId, treatmentId, date, realDuration, revenue, commission) {
        this.id = id;
        this.doctorId = doctorId;
        this.treatmentId = treatmentId;
        this.date = date;
        this.realDuration = realDuration;
        this.revenue = parseFloat(revenue);
        this.commission = parseFloat(commission);
    }
}

class TreatmentModel {
    constructor(id, name, basePrice, providerCost, estimatedDuration) {
        this.id = id;
        this.name = name;
        this.basePrice = parseFloat(basePrice);
        this.providerCost = parseFloat(providerCost);
        this.estimatedDuration = estimatedDuration;
    }
}

class InsightModel {
    constructor(type, summary, recommendedAction, severity) {
        this.type = type;
        this.summary = summary;
        this.recommendedAction = recommendedAction;
        this.severity = severity;
    }
}

module.exports = { AppointmentModel, TreatmentModel, InsightModel };
