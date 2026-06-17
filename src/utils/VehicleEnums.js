export const TRANSMISSION_TYPES = {
    MANUAL: 0,
    AUTOMATIC: 1,
};

export const TRANSMISSION_LABELS = {
    0: "Manual",
    1: "Automatic",
};

export const FUEL_TYPES = {
    PETROL: 0,
    DIESEL: 1,
    HYBRID: 2,
    ELECTRIC: 3,
};

export const FUEL_LABELS = {
    0: "Petrol",
    1: "Diesel",
    2: "Hybrid",
    3: "Electric",
};

export const getTransmissionLabel = (value) => {
    const numValue = Number(value);
    return TRANSMISSION_LABELS[numValue] || "Automatic";
};

export const getFuelLabel = (value) => {
    const numValue = Number(value);
    return FUEL_LABELS[numValue] || "Petrol";
};

export const getTransmissionValue = (label) => {
    const entry = Object.entries(TRANSMISSION_LABELS).find(([_, v]) => v === label);
    return entry ? Number(entry[0]) : TRANSMISSION_TYPES.AUTOMATIC;
};

export const getFuelValue = (label) => {
    const entry = Object.entries(FUEL_LABELS).find(([_, v]) => v === label);
    return entry ? Number(entry[0]) : FUEL_TYPES.PETROL;
};
