import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCcw, Hand, Zap } from 'lucide-react';
import { analyzeGesture } from '../services/geminiService';
import { GestureCommand } from '../types';

interface CameraControlProps {
  onCommand: (command: GestureCommand) => void;
}

export const CameraControl: React.FC<CameraControlProps> = ({ onCommand }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastReasoning, setLastReasoning] = useState<string>('');

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      if (isActive) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: 320, height: 240 } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera error:", err);
          setIsActive(false);
        }
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    setIsProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      const response = await analyzeGesture(base64);
      
      setLastReasoning(response.reasoning);
      onCommand(response.command);
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
      <button 
        onClick={() => setIsActive(!isActive)}
        className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
          isActive ? 'bg-red-500 text-white' : 'bg-gray-800 text-cyan-400 border border-cyan-500/30'
        }`}
      >
        {isActive ? <RefreshCcw className="w-6 h-6 animate-spin-slow" /> : <Camera className="w-6 h-6" />}
      </button>

      {isActive && (
        <div className="bg-gray-900/90 p-4 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-sm w-72 animate-in fade-in slide-in-from-top-5">
          <div className="relative rounded-lg overflow-hidden aspect-video bg-black mb-3 border border-gray-800">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform scale-x-[-1]" 
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
            )}
          </div>
          
          <button 
            onClick={captureAndAnalyze}
            disabled={isProcessing}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Hand className="w-5 h-5" />
            {isProcessing ? 'Analyzing...' : 'Read Gesture'}
          </button>

          <canvas ref={canvasRef} className="hidden" />
          
          {lastReasoning && (
            <div className="mt-3 text-xs text-gray-400 bg-gray-950/50 p-2 rounded border border-gray-800">
              <span className="text-cyan-500 font-bold">AI:</span> {lastReasoning}
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-gray-500">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Open Palm: Nature</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Fist: Fire</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Peace: Galaxy</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500"></span> Hearts: Love</div>
          </div>
        </div>
      )}
    </div>
  );
};
