export const calculateEnvironmentalImpact = (foodWeightKg) => {
  const co2Reduced = foodWeightKg * 2.5;
  const methaneReduced = foodWeightKg * 0.25;

  return {
    co2Reduced: Math.round(co2Reduced * 10) / 10,
    methaneReduced: Math.round(methaneReduced * 10) / 10
  };
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};
