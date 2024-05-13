import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

function QRScanner({ onQRCodeDetected }) {
  const videoRef = useRef();
  const [isQRCodeDetected, setIsQRCodeDetected] = useState(false);

  useEffect(() => {
    let animationId = null;

    const tick = () => {
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && !isQRCodeDetected) {
          console.log('Found QR code', code.data);
          setIsQRCodeDetected(true);
          onQRCodeDetected(code.data);
          return;
        }
      }

      animationId = requestAnimationFrame(tick);
    };

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // required on iOS
        video.play();

        animationId = requestAnimationFrame(tick);
      });

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onQRCodeDetected, isQRCodeDetected]);

  return <video ref={videoRef} />;
}

export default QRScanner;