import React, { useState } from 'react';
import { ParticleEngine } from './components/ParticleEngine';
import { CameraControl } from './components/CameraControl';
import { ParticleTheme, GestureCommand } from './types';
import { Sparkles, Info } from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ParticleTheme>(ParticleTheme.DEFAULT);
  const [showIntro, setShowIntro] = useState(true);

  const handleCommand = (command: GestureCommand) => {
    console.log("Received Command:", command);
    switch (command) {
      case GestureCommand.SWITCH_FIRE:
        setTheme(ParticleTheme.FIRE);
        break;
      case GestureCommand.SWITCH_GALAXY:
        setTheme(ParticleTheme.GALAXY);
        break;
      case GestureCommand.SWITCH_NATURE:
        setTheme(ParticleTheme.NATURE);
        break;
      case GestureCommand.SWITCH_LOVE:
        setTheme(ParticleTheme.LOVE);
        break;
      case GestureCommand.RESET:
        setTheme(ParticleTheme.DEFAULT);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans">
      
      {/* Background Particle Engine */}
      <ParticleEngine theme={theme} />

      {/* UI Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 p-6 flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex justify-between items-start pointer-events-auto">
           <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                Gemini Flow
              </h1>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                Current Theme: <span className="text-white font-bold">{theme}</span>
              </p>
           </div>
        </div>

        {/* Intro Modal (Dismissible) */}
        {showIntro && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
             <div className="bg-gray-900 border border-gray-700 p-8 rounded-3xl max-w-md shadow-2xl m-4">
                <div className="flex justify-center mb-6">
                   <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                      <Sparkles className="w-8 h-8 text-white" />
                   </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-4">Welcome to Gemini Flow</h2>
                <p className="text-gray-300 text-center mb-6 leading-relaxed">
                  Experience a reactive particle system powered by AI.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-cyan-400 font-bold">1</div>
                    <span><strong className="text-white">Touch & Drag</strong> to create physics fields.</span>
                  </div>
                   <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-cyan-400 font-bold">2</div>
                    <span><strong className="text-white">Press & Hold</strong> to attract particles.</span>
                  </div>
                   <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-cyan-400 font-bold">3</div>
                    <span>Use <strong className="text-white">Camera AI</strong> to switch themes with gestures.</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowIntro(false)}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Start Experience
                </button>
             </div>
          </div>
        )}

        {/* Footer Hint */}
        {!showIntro && (
          <div className="text-center pb-4 opacity-50 pointer-events-none">
             <p className="text-xs text-white">Powered by Gemini 2.5 Flash • React • Canvas</p>
          </div>
        )}
      </div>

      {/* Camera Control (Always Accessible) */}
      <div className="pointer-events-auto">
        <CameraControl onCommand={handleCommand} />
      </div>

      {/* Manual Theme Selector (For non-camera users) */}
      <div className="fixed bottom-6 left-6 z-20 pointer-events-auto flex gap-2">
         <button onClick={() => setTheme(ParticleTheme.DEFAULT)} className={`w-3 h-3 rounded-full ${theme === ParticleTheme.DEFAULT ? 'bg-cyan-500 scale-125' : 'bg-gray-600'}`} title="Default"></button>
         <button onClick={() => setTheme(ParticleTheme.FIRE)} className={`w-3 h-3 rounded-full ${theme === ParticleTheme.FIRE ? 'bg-red-500 scale-125' : 'bg-gray-600'}`} title="Fire"></button>
         <button onClick={() => setTheme(ParticleTheme.NATURE)} className={`w-3 h-3 rounded-full ${theme === ParticleTheme.NATURE ? 'bg-green-500 scale-125' : 'bg-gray-600'}`} title="Nature"></button>
         <button onClick={() => setTheme(ParticleTheme.GALAXY)} className={`w-3 h-3 rounded-full ${theme === ParticleTheme.GALAXY ? 'bg-purple-500 scale-125' : 'bg-gray-600'}`} title="Galaxy"></button>
         <button onClick={() => setTheme(ParticleTheme.LOVE)} className={`w-3 h-3 rounded-full ${theme === ParticleTheme.LOVE ? 'bg-pink-500 scale-125' : 'bg-gray-600'}`} title="Love"></button>
      </div>

    </div>
  );
};

export default App;
