export const parseWeightBarcode = (barcode) => {
    if (!barcode || barcode.length !== 13) {
      return null; 
    }
  
    const productCode = barcode.substring(0, 8); // 6 цифр - код товару
    const weightPart = barcode.substring(8, 12); // 4 цифри - вага в грамах
  
    const weightInKg = parseInt(weightPart, 10) / 1000; 
  
    return {
      productCode,
      weightInKg,
    };
  };