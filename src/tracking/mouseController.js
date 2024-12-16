class MouseController {
  constructor() {
    this.smoothingFactor = 0.3; // Adjust for smoother/faster movement
    this.currentX = 0;
    this.currentY = 0;
    this.isEnabled = false;
    this.lastClickTime = 0;
    this.clickCooldown = 500; // ms between clicks
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  updatePosition(x, y) {
    if (!this.isEnabled) return;

    // Smooth movement using linear interpolation
    this.currentX = this.lerp(this.currentX, x, this.smoothingFactor);
    this.currentY = this.lerp(this.currentY, y, this.smoothingFactor);

    // Move the cursor
    this.moveCursor(this.currentX, this.currentY);
  }

  click() {
    const now = Date.now();
    if (now - this.lastClickTime < this.clickCooldown) return;

    this.lastClickTime = now;
    this.triggerClick(this.currentX, this.currentY);
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  moveCursor(x, y) {
    const event = new MouseEvent('mousemove', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y
    });
    document.dispatchEvent(event);
  }

  triggerClick(x, y) {
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y
    });
    document.dispatchEvent(clickEvent);
  }
}

export const mouseController = new MouseController();