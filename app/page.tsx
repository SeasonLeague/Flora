'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PlantData {
  name?: string;
  scientificName?: string;
  description?: string;
  careInstructions?: string[];
  healthStatus?: string;
  preventiveMeasures?: string[];
  family?: string;
  origin?: string;
  growthRate?: string;
  maxHeight?: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PlantData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setIsCameraActive(false);
      console.log("File selected:", selectedFile);
    }
  };


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setFile(null);
        setPreview(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check your permissions.");
    }
  };

  const handleIdentify = async () => {
    console.log("Identify Button Cliked")
    if (file) {
      console.log("Processing Uploade file:", file);
      await processImage(file);
    } else if (isCameraActive && videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.toBlob(async (blob) => {
          if (blob) {
            const capturedFile = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
            setFile(capturedFile);
            setPreview(URL.createObjectURL(blob));
            console.log("Processing captured file", capturedFile);
            await processImage(capturedFile);
          }
        }, 'image/jpeg');
      }
    }
  };
  const processImage = async (imageFile: File) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', imageFile);

    console.log("Sending request with for data:", formData);

    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen gradient-background">


      <main className="flex-grow bg-gradient-to-b from-green-100 to-green-300 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-green-800">FloraFusion Plant Classifier</h1>
            <p className="text-center text-gray-600 mb-6">Upload or capture a photo of any plant and get instant information!</p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <button
                onClick={startCamera}
                className="w-full sm:w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Open Camera
              </button>
              <label className="w-full sm:w-1/2">
                <span className="sr-only">Choose file</span>
                <input 
                  type="file"
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>

            <div className="mb-6">
              <video ref={videoRef} className="w-full h-auto" autoPlay playsInline style={{display: file ? 'none' : 'block'}}></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
              {preview && (
                <div className="relative w-full h-64 sm:h-96">
                  <Image 
                    src={preview} 
                    alt="Preview" 
                    layout="fill" 
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleIdentify}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                disabled={loading || (!file && !isCameraActive)}
              >
                {loading ? 'Processing...' : 'Identify'}
              </button>
            </div>

            {error && (
              <div className="mt-8 p-4 bg-red-50 rounded-lg text-red-600">
                Error: {error}
              </div>
            )}

            {result && (
              <div className="mt-8 bg-green-50 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-3xl font-bold mb-4 text-green-800">{result.name}</h2>
                  {result.scientificName && <p className="italic text-xl mb-4 text-green-600">{result.scientificName}</p>}
                  {result.description && <p className="mb-6 text-gray-700">{result.description}</p>}
                </div>

                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-semibold mb-4 text-green-700">Plant Information</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        <tr className="border-b">
                          <th className="py-2 px-4 bg-green-100">Family</th>
                          <td className="py-2 px-4">{result.family || "Unknown"}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="py-2 px-4 bg-green-100">Origin</th>
                          <td className="py-2 px-4">{result.origin || "Unknown"}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="py-2 px-4 bg-green-100">Growth Rate</th>
                          <td className="py-2 px-4">{result.growthRate || "Unknown"}</td>
                        </tr>
                        <tr>
                          <th className="py-2 px-4 bg-green-100">Max Height</th>
                          <td className="py-2 px-4">{result.maxHeight || "Unknown"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {result.careInstructions && result.careInstructions.length > 0 && (
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-4 text-green-700">Care Instructions</h3>
                    <ul className="list-disc pl-5 mb-4 text-gray-700">
                      {result.careInstructions.map((instruction, index) => (
                        <li key={index} className="mb-2">{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.healthStatus && (
                  <div className="p-6 bg-white">
                    <h3 className="text-2xl font-semibold mb-4 text-green-700">Health Status</h3>
                    <p className="font-medium mb-2">
                      Status: <span className={result.healthStatus === 'Healthy' ? 'text-green-600' : 'text-red-600'}>{result.healthStatus}</span>
                    </p>
                    {result.healthStatus !== 'Healthy' && result.preventiveMeasures && result.preventiveMeasures.length > 0 && (
                      <>
                        <h4 className="font-semibold mb-2 text-green-600">Preventive Measures:</h4>
                        <ul className="list-disc pl-5 mb-4 text-gray-700">
                          {result.preventiveMeasures.map((measure, index) => (
                            <li key={index} className="mb-2">{measure}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-center text-green-800 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Upload Photo", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z", description: "Take a clear photo of the plant or upload an existing image to get started." },
              { title: "Instant Identification", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", description: "Our AI quickly analyzes the image and identifies the plant species." },
              { title: "Detailed Information", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", description: "Get comprehensive details about the plant, including its scientific name and family." },
              { title: "Care Instructions", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z", description: "Learn how to properly care for your plant with tailored instructions and tips." },
              { title: "Health Assessment", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", description: "Get insights into your plant's health status and preventive measures if needed." },
              { title: "Botanical Knowledge", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", description: "Expand your plant knowledge with interesting facts and botanical information." },
            ].map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon}></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-700">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}