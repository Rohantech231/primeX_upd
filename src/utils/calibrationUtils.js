export function calculateCalibrationAccuracy(samples, baseline) {
  if (!samples || !baseline || samples.length === 0) {
    return 0;
  }

  const deviations = samples.map(sample => {
    const leftDev = getPointDeviation(sample.left, baseline.left);
    const rightDev = getPointDeviation(sample.right, baseline.right);
    return (leftDev + rightDev) / 2;
  });

  const avgDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;
  return Math.max(0, 100 - (avgDeviation * 10));
}

function getPointDeviation(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}