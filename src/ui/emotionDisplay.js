const emotions = ['happiness', 'sadness', 'anger'];

export function updateEmotionMetrics(emotions) {
  Object.entries(emotions).forEach(([emotion, value]) => {
    updateProgressBar(emotion, value);
  });
}

function updateProgressBar(emotion, value) {
  const progressBar = document.getElementById(`${emotion}-progress`);
  const valueDisplay = document.getElementById(`${emotion}-value`);
  
  if (progressBar && valueDisplay) {
    progressBar.style.width = `${value}%`;
    valueDisplay.textContent = `${value}%`;
  }
}