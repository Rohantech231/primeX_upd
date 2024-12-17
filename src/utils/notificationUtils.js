export function showError(message) {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = 'error';
  }
  console.error(message);
}

export function showSuccess(message) {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = 'success';
  }
  console.log(message);
}

export function showWarning(message) {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = 'warning';
  }
  console.warn(message);
}