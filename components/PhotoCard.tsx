import React from 'react';
import { Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { GeneratedImage, StyleConfig } from '../types';

interface PhotoCardProps {
  styleConfig: StyleConfig;
  result?: GeneratedImage;
  onRetry: (styleId: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ styleConfig, result, onRetry }) => {
  const isLoading = result?.isLoading;
  const imageUrl = result?.imageUrl;
  const error = result?.error;

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageUrl}`;
    link.download = `nano-studio-${styleConfig.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl flex flex-col h-full transition-transform hover:scale-[1.02] duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm relative z-10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {styleConfig.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{styleConfig.description}</p>
      </div>

      {/* Image Area */}
      <div className="relative aspect-square bg-slate-900 group">
        {!isLoading && !imageUrl && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
            <Sparkles className="w-12 h-12 mb-2 opacity-20" />
            <span className="text-sm font-medium opacity-40">Waiting to start...</span>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <p className="text-indigo-400 text-xs mt-3 animate-pulse font-medium">Creating Art...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900 z-20">
             <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
             <p className="text-rose-400 text-sm mb-4">Generation Failed</p>
             <button 
               onClick={() => onRetry(styleConfig.id)}
               className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-xs font-medium text-white transition-colors flex items-center gap-2"
             >
               <RefreshCw className="w-3 h-3" /> Retry
             </button>
          </div>
        )}

        {imageUrl && (
          <>
            <img 
              src={`data:image/png;base64,${imageUrl}`} 
              alt={styleConfig.title} 
              className="w-full h-full object-cover animate-fade-in"
            />
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
              <button 
                onClick={handleDownload}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all hover:scale-110"
                title="Download"
              >
                <Download className="w-6 h-6" />
              </button>
              <button 
                onClick={() => onRetry(styleConfig.id)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all hover:scale-110"
                title="Regenerate"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoCard;