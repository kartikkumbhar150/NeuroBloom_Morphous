"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Camera, Mic, ArrowRight, CheckCircle2, XCircle, AlertCircle, Settings2, Video, ShieldCheck, Bluetooth } from 'lucide-react';
import { useVideo } from "@/context/VideoContext";
import { useTranslation } from "@/hooks/useTranslation";

interface PermissionsScreenProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function PermissionsScreen({ onComplete, onBack }: PermissionsScreenProps) {
  const { t } = useTranslation();
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [btPermission, setBtPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  
  const [requestingCamera, setRequestingCamera] = useState(false);
  const [requestingMic, setRequestingMic] = useState(false);
  const [requestingBt, setRequestingBt] = useState(false);
  
  const { startRecording } = useVideo();

  const handleProceed = async () => {
    try {
      await startRecording();
      onComplete();
    } catch (e) {
      alert(t("ps_err_hw"));
    }
  };

  // --- ASLI LOGIC (Camera & Mic) ---
  const requestCameraPermission = async () => {
    setRequestingCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
    } catch (error) {
      setCameraPermission('denied');
    } finally {
      setRequestingCamera(false);
    }
  };

  const requestMicPermission = async () => {
    setRequestingMic(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission('granted');
    } catch (error) {
      setMicPermission('denied');
    } finally {
      setRequestingMic(false);
    }
  };

  // --- FAKE LOGIC (Bluetooth) ---
  const requestBluetoothPermission = () => {
    setRequestingBt(true);
    // Fake delay to simulate searching
    setTimeout(() => {
      setBtPermission('granted');
      setRequestingBt(false);
    }, 1500);
  };

  const canProceed = cameraPermission === 'granted' && micPermission === 'granted' && btPermission === 'granted';

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex items-center justify-center p-6 overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl" 
      >
        <div className="bg-white rounded-[1.5rem] shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-900 px-10 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <Settings2 className="text-indigo-400" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">{t('ps_calibration')}</h1>
                <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">{t('ps_readiness')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span className="text-[10px] text-white font-bold uppercase tracking-wider">{t('ps_secure')}</span>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-3 px-5 py-3 bg-indigo-50 border border-indigo-100 rounded-xl mb-8">
              <AlertCircle size={16} className="text-indigo-600" />
              <p className="text-[12px] text-indigo-900 font-medium">
                {t('ps_warning')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              
              {/* Asli Camera */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${
                cameraPermission === 'granted' ? 'bg-emerald-50/30 border-emerald-500/20' : 
                cameraPermission === 'denied' ? 'bg-red-50/30 border-red-500/20' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    cameraPermission === 'granted' ? 'bg-emerald-500' : 
                    cameraPermission === 'denied' ? 'bg-red-500' : 'bg-slate-200'
                  }`}>
                    <Video size={20} className={cameraPermission === 'pending' ? 'text-slate-600' : 'text-white'} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{t('ps_optical')}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">{t('ps_optical_desc')}</p>
                  </div>
                  
                  {cameraPermission === 'pending' ? (
                    <button 
                      onClick={requestCameraPermission}
                      disabled={requestingCamera}
                      className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      {requestingCamera ? t('ps_initializing') : t('ps_enable_camera')}
                    </button>
                  ) : (
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
                      cameraPermission === 'granted' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {cameraPermission === 'granted' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {cameraPermission === 'granted' ? t('ps_configured') : t('ps_blocked')}
                    </div>
                  )}
                </div>
              </div>

              {/* Asli Microphone */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${
                micPermission === 'granted' ? 'bg-emerald-50/30 border-emerald-500/20' : 
                micPermission === 'denied' ? 'bg-red-50/30 border-red-500/20' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    micPermission === 'granted' ? 'bg-emerald-500' : 
                    micPermission === 'denied' ? 'bg-red-500' : 'bg-slate-200'
                  }`}>
                    <Mic size={20} className={micPermission === 'pending' ? 'text-slate-600' : 'text-white'} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{t('ps_acoustic')}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">{t('ps_acoustic_desc')}</p>
                  </div>

                  {micPermission === 'pending' ? (
                    <button 
                      onClick={requestMicPermission}
                      disabled={requestingMic}
                      className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      {requestingMic ? t('ps_initializing') : t('ps_enable_mic')}
                    </button>
                  ) : (
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
                      micPermission === 'granted' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {micPermission === 'granted' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {micPermission === 'granted' ? t('ps_configured') : t('ps_blocked')}
                    </div>
                  )}
                </div>
              </div>

              {/* Fake Bluetooth */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${
                btPermission === 'granted' ? 'bg-emerald-50/30 border-emerald-500/20' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    btPermission === 'granted' ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}>
                    <Bluetooth size={20} className={btPermission === 'pending' ? 'text-slate-600' : 'text-white'} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{t('ps_neural')}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">{t('ps_neural_desc')}</p>
                  </div>

                  {btPermission === 'pending' ? (
                    <button 
                      onClick={requestBluetoothPermission}
                      disabled={requestingBt}
                      className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      {requestingBt ? t('ps_scanning') : t('ps_pair_device')}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      <CheckCircle2 size={14} /> {t('ps_linked')}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-slate-100">
              <motion.button
                whileHover={canProceed ? { scale: 1.01 } : {}}
                whileTap={canProceed ? { scale: 0.99 } : {}}
                onClick={handleProceed}
                disabled={!canProceed}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-xl ${
                  canProceed 
                    ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {canProceed ? t('ps_launch') : t('ps_hw_setup')}
                {canProceed && <ArrowRight size={18} />}
              </motion.button>
              
              <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed font-bold uppercase tracking-widest">
                {t('ps_validation')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-8">
           <Step label={t('sf_step_info')} completed />
           <div className="w-12 h-[1px] bg-indigo-600" />
           <Step label={t('tc_step_consent')} completed />
           <div className="w-12 h-[1px] bg-indigo-600" />
           <Step label={t('ps_step_hw')} active />
        </div>
      </motion.div>
    </div>
  );
}

function Step({ label, active = false, completed = false }: { label: string, active?: boolean, completed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full transition-all ${
        completed ? 'bg-indigo-600' : 
        active ? 'bg-indigo-600 ring-4 ring-indigo-50' : 
        'bg-slate-300'
      }`} />
      <span className={`text-[10px] font-bold uppercase tracking-widest ${active || completed ? 'text-slate-900' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}