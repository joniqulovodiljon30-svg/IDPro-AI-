import React, { useState } from 'react';
import UploadArea from './components/UploadArea';
import PhotoCard from './components/PhotoCard';
import { SparklesIcon } from './components/Icons';
import { GeneratedPhoto, PhotoType } from './types';
import { generateIDPhoto } from './services/geminiService';

const INITIAL_STATE: GeneratedPhoto[] = Object.values(PhotoType).map(type => ({
  type,
  imageUrl: null,
  loading: false
}));

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedPhoto[]>(INITIAL_STATE);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageSelected = (base64: string) => {
    setSelectedImage(base64);
    // Reset results when new image uploaded, but keep structure
    setResults(INITIAL_STATE);
  };

  const generateSinglePhoto = async (type: PhotoType, image: string) => {
    try {
      const url = await generateIDPhoto(image, type);
      setResults(prev => prev.map(p => 
        p.type === type ? { ...p, loading: false, imageUrl: url } : p
      ));
    } catch (error) {
      setResults(prev => prev.map(p => 
        p.type === type ? { ...p, loading: false, error: 'Failed' } : p
      ));
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || isGenerating) return;

    setIsGenerating(true);
    
    // Set all to loading initially
    setResults(prev => prev.map(p => ({ ...p, loading: true, error: undefined, imageUrl: null })));

    // Trigger all generations in parallel
    const promises = Object.values(PhotoType).map(type => 
      generateSinglePhoto(type, selectedImage)
    );

    await Promise.allSettled(promises);
    setIsGenerating(false);
  };

  const handleRetry = (type: PhotoType) => {
    if (!selectedImage) return;
    setResults(prev => prev.map(p => 
      p.type === type ? { ...p, loading: true, error: undefined } : p
    ));
    generateSinglePhoto(type, selectedImage);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-200">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-200 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:h-screen lg:flex lg:flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 lg:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <SparklesIcon className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                IDPro AI
              </h1>
              <p className="text-xs text-slate-500 font-medium">Official Document Generator</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="px-3 py-1 bg-white/60 backdrop-blur border border-white/50 rounded-full text-xs font-medium text-slate-500">
              v2.5 Flash Powered
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 lg:grid lg:grid-cols-12 lg:gap-8 min-h-0">
          
          {/* Left Panel: Upload & Controls */}
          <div className="lg:col-span-5 flex flex-col gap-6 mb-8 lg:mb-0 h-full">
            <div className="flex-1 glass-panel rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-0 transition-opacity duration-300" style={{opacity: isGenerating ? 1 : 0}}></div>
              
              <div className="flex-1 min-h-[300px]">
                <UploadArea 
                  onImageSelected={handleImageSelected} 
                  selectedImage={selectedImage}
                  isGenerating={isGenerating}
                />
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGenerate}
                  disabled={!selectedImage || isGenerating}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3
                    ${!selectedImage || isGenerating
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/40 hover:-translate-y-1'
                    }
                  `}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      Generate Photos
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  AI will auto-align face, change background, and apply formal attire.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Gallery */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 h-full content-start">
              {results.map((photo) => (
                <div key={photo.type} className="h-full min-h-[280px]">
                  <PhotoCard 
                    data={photo} 
                    onRetry={() => handleRetry(photo.type)}
                  />
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;