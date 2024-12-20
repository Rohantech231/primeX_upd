export function updateEmotionMetrics(emotions) {
  Object.entries(emotions).forEach(([emotion, value]) => {
    const progressBar = document.getElementById(`${emotion}-progress`);
    const valueDisplay = document.getElementById(`${emotion}-value`);
    
    if (progressBar && valueDisplay) {
      progressBar.style.width = `${value}%`;
      valueDisplay.textContent = `${value}%`;
    }
  });
}