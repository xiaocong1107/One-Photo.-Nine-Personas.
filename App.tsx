import React, { useState, useCallback } from 'react';
import { Camera, Sparkles, Zap } from 'lucide-react';
import UploadSection from './components/UploadSection';
import PhotoCard from './components/PhotoCard';
import { PHOTO_STYLES } from './constants';
import { GeneratedImage } from './types';
import { generateStyledImage } from './services/geminiService';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, GeneratedImage>>({});
  const [isGlobalProcessing, setIsGlobalProcessing] = useState(false);

  const triggerGeneration = useCallback(async (styleId: string, imageBase64: string) => {
    // Set loading state for this specific card
    setResults(prev => ({
      ...prev,
      [styleId]: { styleId, isLoading: true, imageUrl: undefined, error: undefined }
    }));

    const style = PHOTO_STYLES.find(s => s.id === styleId);
    if (!style) return;

    try {
      const generatedBase64 = await generateStyledImage(imageBase64, style.prompt);
      
      setResults(prev => ({
        ...prev,
        [styleId]: { 
          styleId, 
          isLoading: false, 
          imageUrl: generatedBase64 
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [styleId]: { 
          styleId, 
          isLoading: false, 
          error: 'Failed to generate image' 
        }
      }));
    }
  }, []);

  const handleImageSelect = useCallback((base64: string) => {
    setSourceImage(base64);
    setIsGlobalProcessing(true);

    // Reset all previous results
    const initialResults: Record<string, GeneratedImage> = {};
    PHOTO_STYLES.forEach(style => {
      initialResults[style.id] = { styleId: style.id, isLoading: true };
    });
    setResults(initialResults);

    // Launch generations with a small stagger to avoid hitting rate limits instantly if any
    // Although flash-image is fast, spacing them out slightly is good for UI feedback
    PHOTO_STYLES.forEach((style, index) => {
      setTimeout(() => {
        triggerGeneration(style.id, base64);
        if (index === PHOTO_STYLES.length - 1) {
            setIsGlobalProcessing(false);
        }
      }, index * 200); // 200ms stagger
    });
  }, [triggerGeneration]);

  const handleRetry = useCallback((styleId: string) => {
    if (sourceImage) {
      triggerGeneration(styleId, sourceImage);
    }
  }, [sourceImage, triggerGeneration]);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
               <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Nano Studio AI
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
             <Zap className="w-4 h-4 text-yellow-400" />
             <span>Powered by Gemini 2.5 Flash</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            One Photo. <span className="text-indigo-400">Nine Personas.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload a single portrait and instantly generate professional, artistic, and cinematic variations using our advanced "Nano Banana" AI model.
          </p>
        </div>

        {/* Upload Area */}
        <UploadSection 
          onImageSelect={handleImageSelect} 
          isProcessing={isGlobalProcessing} 
          selectedImage={sourceImage} 
        />

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PHOTO_STYLES.map((style) => (
            <PhotoCard
              key={style.id}
              styleConfig={style}
              result={results[style.id]}
              onRetry={handleRetry}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20 py-8 text-center text-slate-500 text-sm">
        <p>© 2025 Nano Studio AI. All generated images are created by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;