import * as faceapi from 'face-api.js';

export class CanvasManager {
  constructor(canvas, videoElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.setDimensions(videoElement);
  }

  setDimensions(videoElement) {
    this.canvas.width = videoElement.width;
    this.canvas.height = videoElement.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawFaceLandmarks(detection) {
    faceapi.draw.drawFaceLandmarks(this.canvas, detection);
  }
}