import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, RefreshCw } from 'lucide-react';
import axios from 'axios';
import AnimatedResultCard from './animated-result-card';

interface Disease {
  id: number;
  name: string;
  description: string;
  treatment_suggestions: string;
  source_url: string | null;
}

interface Scan {
  id: number;
  image_path: string;
  predicted_disease: string;
  confidence: number;
  created_at: string;
}

interface PredictionResult {
  scan: Scan;
  disease: Disease;
}

const PlantScanner: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanAnimation, setScanAnimation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setScanResult(null);
        setError(null);
      } else {
        setError('Please drop an image file.');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setScanAnimation(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post('/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        withCredentials: true
      });

      // Wait a bit to show the scanning animation
      setTimeout(() => {
        setScanResult(response.data);
        setIsLoading(false);
        setScanAnimation(false);
      }, 1500);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.response?.data?.error || 'Prediction failed.');
      setIsLoading(false);
      setScanAnimation(false);
    }
  };

  const resetScan = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setScanResult(null);
    setError(null);
    setScanAnimation(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setScanResult(null);
        setError(null);
      }
    } catch (err) {
      setError('Unable to access camera.');
      console.error('Camera error:', err);
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            closeCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  // If we have scan results, show the animated result card
  if (scanResult) {
    return (
      <AnimatedResultCard 
        scan={scanResult.scan} 
        disease={scanResult.disease}
        onNewScan={resetScan}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Plant Disease Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {!previewUrl && !cameraActive ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">
                Drag & drop an image here, or click to select a file
              </p>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="file-upload"
              />
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Image
                </Button>
                <Button 
                  variant="outline"
                  onClick={openCamera}
                >
                  Use Camera
                </Button>
              </div>
            </motion.div>
          ) : cameraActive ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    className="w-full max-w-md h-auto rounded-lg border border-gray-200 shadow-sm" 
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </motion.div>
              </div>
              <div className="flex justify-center gap-3">
                <Button onClick={takePhoto}>Capture Photo</Button>
                <Button variant="outline" onClick={closeCamera}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img 
                    src={previewUrl!} 
                    alt="Preview" 
                    className="w-full max-w-md h-auto rounded-lg border border-gray-200 shadow-sm" 
                  />
                  
                  {scanAnimation && (
                    <motion.div 
                      className="absolute inset-0 bg-blue-500 opacity-20 rounded-lg"
                      initial={{ top: 0 }}
                      animate={{ 
                        top: ['0%', '100%', '0%'],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  )}
                </motion.div>
              </div>
              <div className="flex justify-center gap-3">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    'Analyze Plant'
                  )}
                </Button>
                <Button variant="outline" onClick={resetScan}>
                  Change Image
                </Button>
              </div>
            </div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm"
            >
              {error}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantScanner; 