export async function captureImageFromVideo(video: HTMLVideoElement): Promise<Blob> {
  // Wait for video to be ready
  if (video.readyState !== video.HAVE_ENOUGH_DATA) {
    await new Promise(resolve => {
      video.addEventListener('loadeddata', resolve, { once: true });
    });
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  ctx.drawImage(video, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to capture image'));
        }
      },
      'image/jpeg',
      0.8
    );
  });
}