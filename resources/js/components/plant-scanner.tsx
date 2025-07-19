import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
      setSuccessMessage(null);
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
        setSuccessMessage(null);
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
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const response = await axios.post('/predictions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken || '',
        },
        withCredentials: true,
        timeout: 120000, // 2 minutes timeout
      });

      // Wait a bit to show the scanning animation
      setTimeout(() => {
        setScanResult(response.data);
        setIsLoading(false);
        setScanAnimation(false);
        setSuccessMessage('Scan completed successfully!');
      }, 1500);
    } catch (err: any) {
      console.error('API Error:', err);
      let errorMessage = 'Prediction failed.';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsLoading(false);
      setScanAnimation(false);
    }
  };

  const resetScan = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setScanResult(null);
    setError(null);
    setSuccessMessage(null);
    setScanAnimation(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setScanResult(null);
        setError(null);
        setSuccessMessage(null);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
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
        }, "image/jpeg", 0.9);
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
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Camera className="h-5 w-5" />
          Plant Disease Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-green-300 text-sm">{successMessage}</span>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </motion.div>
        )}

        <div 
          className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-800"
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
              <p className="text-sm text-gray-400">
                Drag & drop an image here, or click to select a file
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF (max 2MB)
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <Button
                  onClick={openCamera}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Use Camera
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </motion.div>
          ) : cameraActive ? (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={takePhoto}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button
                  onClick={closeCamera}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previewUrl!}
                  alt="Preview"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                {scanAnimation && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      </motion.div>
                      <p className="text-white text-sm">Analyzing plant health...</p>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                      </motion.div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Scan Plant
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetScan}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2">Tips for better results:</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Ensure good lighting and clear focus</li>
            <li>• Capture the entire affected area</li>
            <li>• Avoid shadows and reflections</li>
            <li>• Use high-resolution images when possible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantScanner; 