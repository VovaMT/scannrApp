export const parseWeightBarcode = (code) => {
    if (!code || code.length !== 13) {
        return null;
    }

    const barCode = code.substring(0, 8); // 8 цифр - код товару
    const weight = code.substring(8, 12); // 4 цифри - вага в грамах

    const weightInKg = parseInt(weight, 10) / 1000;

    return {
        barCode,
        weightInKg,
    };
};