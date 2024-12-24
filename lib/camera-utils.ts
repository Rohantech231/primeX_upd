export async function initializeCamera(videoRef: React.RefObject<HTMLVideoElement>) {
  try {
    const constraints = {
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    return { stream, error: null };
  } catch (err) {
    return {
      stream: null,
      error: err instanceof Error ? err.message : 'Failed to initialize camera'
    };
  }
}