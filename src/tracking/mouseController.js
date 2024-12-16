let lastClickTime = 0;

export function simulateMouseClick() {
  const now = Date.now();
  if (now - lastClickTime < 500) return; // Prevent rapid clicks
  
  const click = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  document.dispatchEvent(click);
  lastClickTime = now;
}

export function updateMousePosition(x, y) {
  // Convert normalized coordinates to screen coordinates
  const screenX = Math.round(x * window.innerWidth);
  const screenY = Math.round(y * window.innerHeight);
  
  // Create and dispatch a custom mouse move event
  const moveEvent = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: screenX,
    clientY: screenY
  });
  
  document.dispatchEvent(moveEvent);
}