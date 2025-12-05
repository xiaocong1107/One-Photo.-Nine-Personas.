import React, { useCallback } from 'react';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';

interface UploadSectionProps {
  onImageSelect: (base64: string) => void;
  isProcessing: boolean;
  selectedImage: string | null;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onImageSelect, isProcessing, selectedImage }) => {
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageSelect(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  return (
    <div className="w-full max-w-xl mx-auto mb-12">
      <div className="relative group cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className={`
          border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center
          ${selectedImage 
            ? 'border-indigo-500/50 bg-indigo-500/5' 
            : 'border-slate-600 hover:border-indigo-400 bg-slate-800/50 hover:bg-slate-800'}
        `}>
          
          {selectedImage ? (
            <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg shadow-indigo-500/20">
              <img src={selectedImage} alt="Original" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-semibold">Change Photo</p>
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 mb-4 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-slate-600 transition-colors">
              <Upload className="w-10 h-10 text-indigo-400" />
            </div>
          )}

          <h3 className="text-xl font-semibold text-white mb-2">
            {selectedImage ? 'Photo Selected' : 'Upload Portrait'}
          </h3>
          <p className="text-slate-400 text-center text-sm max-w-xs">
            {selectedImage 
              ? 'Click to choose a different photo' 
              : 'Select a clear photo of a person to generate 9 professional styles instantly.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;