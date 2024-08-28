'use client';

import { useState } from 'react';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });
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
    <div className="flex flex-col min-h-screen">
      <nav className="bg-green-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Plant Identifier</Link>
          <ul className="flex space-x-4">
            <li><Link href="/" className="hover:text-green-200">Home</Link></li>
            <li><Link href="/about" className="hover:text-green-200">About</Link></li>
            <li><Link href="/contact" className="hover:text-green-200">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-green-200">FAQ</Link></li>
          </ul>
        </div>
      </nav>

      <main className="flex-grow bg-gradient-to-b from-green-100 to-green-300 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-2 text-center text-green-800">Plant Identifier</h1>
            <p className="text-center text-gray-600 mb-6">Upload a photo of any plant and get instant information!</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 overflow-hidden">
                  {preview ? (
                    <div className="relative w-full h-full">
                      <Image 
                        src={preview} 
                        alt="Preview" 
                        layout="fill" 
                        objectFit="contain"
                        className="rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                  )}
                  <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" aria-label="Upload plant image" />
                </label>
              </div>
              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300" disabled={!file || loading} aria-label="Identify plant">
                {loading ? 'Processing...' : 'Identify Plant'}
              </button>
            </form>

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

                {preview && (
                  <div className="relative w-full h-96 mb-6">
                    <Image 
                      src={preview} 
                      alt={result.name || "Uploaded plant"} 
                      layout="fill" 
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                )}

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
      </main>

      <footer className="bg-green-800 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Us</h3>
              <p>We're passionate about helping people identify and care for plants. Our AI-powered tool makes plant identification easy and accessible.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-green-200">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-green-200">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-green-200">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <p>Follow us on social media for plant care tips and updates:</p>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="hover:text-green-200">Facebook</a>
                <a href="#" className="hover:text-green-200">Twitter</a>
                <a href="#" className="hover:text-green-200">Instagram</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-green-700 text-center">
            <p>&copy; 2024 Plant Identifier. All rights reserved.</p>
            <p className="mt-2">With love built by Chinemelum</p>
          </div>
        </div>
      </footer>
    </div>
  );
}