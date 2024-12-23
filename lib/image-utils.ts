export async function captureImageFromVideo(video: HTMLVideoElement): Promise<string> {
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
  
  // Convert to base64 and remove data URL prefix
  const base64Data = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  
  if (!base64Data) throw new Error('Failed to capture image');
  return base64Data;
}