import { useEffect, useRef } from 'react';
import jsQR from 'jsqr';

function QRScanner({ onQRCodeDetected }) {
  const videoRef = useRef();

  useEffect(() => {
    const tick = () => {
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          console.log('Found QR code', code.data);
          onQRCodeDetected(code.data);
        }
      }

      requestAnimationFrame(tick);
    };

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // required on iOS
        video.play();

        requestAnimationFrame(tick);
      });

  }, [onQRCodeDetected]);

  return <video ref={videoRef} />;
}

export default QRScanner;
