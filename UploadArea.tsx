import React, { useCallback, useState } from 'react';
import { UploadIcon, UserIcon } from './Icons';

interface UploadAreaProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
  isGenerating: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageSelected, selectedImage, isGenerating }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelected(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onImageSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex-1 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center p-8 overflow-hidden min-h-[400px]
          ${isDragging 
            ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' 
            : 'border-slate-200 hover:border-blue-300 bg-white/50'}
          ${selectedImage ? 'border-none p-0' : ''}
        `}
      >
        {selectedImage ? (
          <div className="relative w-full h-full group">
            <img 
              src={selectedImage} 
              alt="Uploaded Preview" 
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
              <label className="cursor-pointer bg-white/20 backdrop-blur-md border border-white/40 text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all font-medium flex items-center gap-2">
                <UploadIcon className="w-5 h-5" />
                Change Photo
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileInput}
                  disabled={isGenerating}
                />
              </label>
            </div>
          </div>
        ) : (
          <>
            <div className={`
              w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6
              ${isDragging ? 'scale-110' : ''} transition-transform duration-300
            `}>
              <UserIcon className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Upload your photo</h3>
            <p className="text-slate-500 text-center max-w-xs mb-8">
              Drag & drop your portrait here, or click to browse.
              <br/>
              <span className="text-xs text-slate-400 mt-2 block">Supported formats: JPG, PNG</span>
            </p>
            <label className={`
              cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl 
              font-medium shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5
              flex items-center gap-2
            `}>
              <UploadIcon className="w-5 h-5" />
              Select Photo
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileInput}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadArea;