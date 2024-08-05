import React, { useRef } from 'react';
import { Button } from '@mui/material';
import { storage } from '../src/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CameraCapture = ({ onUpload }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => console.error(err));
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    canvasRef.current.toBlob((blob) => {
      const storageRef = ref(storage, `images/${Date.now()}.jpg`);
      uploadBytes(storageRef, blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          onUpload(url);
        });
      });
    });
  };

  return (
    <div>
      <video ref={videoRef} width="640" height="480" />
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
      <Button onClick={startCamera} variant="contained">Start Camera</Button>
      <Button onClick={capturePhoto} variant="contained" color="primary">Capture Photo</Button>
    </div>
  );
};

export default CameraCapture;