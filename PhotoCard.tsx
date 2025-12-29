import React from 'react';
import { DownloadIcon, LoaderIcon, AlertIcon, RefreshIcon } from './Icons';
import { GeneratedPhoto, PHOTO_CONFIGS } from '../types';

interface PhotoCardProps {
  data: GeneratedPhoto;
  onRetry: () => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ data, onRetry }) => {
  const config = PHOTO_CONFIGS[data.type];

  const handleDownload = () => {
    if (data.imageUrl) {
      const link = document.createElement('a');
      link.href = data.imageUrl;
      link.download = `IDPro_${data.type.replace(/\s/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">{data.type}</h4>
          <p className="text-xs text-slate-500 truncate max-w-[120px]">{config.bgColor} bg</p>
        </div>
        <div className={`w-2 h-2 rounded-full ${
          data.loading ? 'bg-yellow-400 animate-pulse' : 
          data.error ? 'bg-red-400' : 
          data.imageUrl ? 'bg-green-400' : 'bg-slate-300'
        }`} />
      </div>

      <div className="relative aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden group flex-1">
        {data.loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
            <LoaderIcon className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-xs text-blue-500 font-medium animate-pulse">AI Processing...</span>
            <div className="absolute bottom-0 left-0 h-1 bg-blue-500/20 w-full">
              <div className="h-full bg-blue-500 animate-progress-indeterminate"></div>
            </div>
          </div>
        ) : data.error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-4 text-center">
            <AlertIcon className="w-8 h-8 text-red-400 mb-2" />
            <span className="text-xs text-red-500 font-medium">Generation Failed</span>
            <button 
              onClick={onRetry}
              className="mt-3 text-xs bg-white text-red-500 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors flex items-center gap-1"
            >
              <RefreshIcon className="w-3 h-3" /> Retry
            </button>
          </div>
        ) : data.imageUrl ? (
          <>
            <img 
              src={data.imageUrl} 
              alt={data.type} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
              <button 
                onClick={handleDownload}
                className="w-full bg-white text-slate-900 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
              >
                <DownloadIcon className="w-4 h-4" />
                Download
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <span className="text-4xl opacity-20">AI</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCard;