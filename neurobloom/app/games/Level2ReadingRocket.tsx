"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Mic, Check, Square } from 'lucide-react';
import { useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";


interface Level2Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level2ReadingRocket({ onComplete, onProgress }: Level2Props) {
  const { t } = useTranslation();
  const [currentGame, setCurrentGame] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsSaving(true);
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });

        const formData = new FormData();
        formData.append("file", audioBlob, "reading.webm");

        try {
          const upload = await fetch("/api/upload", {
            method: "POST",
            body: formData
          });

          const uploadRes = await upload.json();
          const url = uploadRes.url;

          if (!url) {
            console.error("Upload failed:", uploadRes.error);
            setIsSaving(false);
            setIsRecording(false);
            return;
          }

          const sessionId = localStorage.getItem("sessionId");
          await fetch("/api/session/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              payload: currentGame === 0 
                ? { test2_audio1: url } 
                : { test2_audio2: url }
            })
          });

          setHasRecorded(true);
        } catch (error) {
          console.error("Process failed:", error);
        } finally {
          mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
          setIsRecording(false);
          setIsSaving(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const finishRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
  };

  const handleNext = () => {
    if (currentGame < 1) {
      setCurrentGame(currentGame + 1);
      onProgress(currentGame + 1);
      setHasRecorded(false);
    } else {
      onComplete();
    }
  };

  const games = [
    // Reading 1
    <div key="reading1" className="text-center max-w-2xl mx-auto px-4">
      <h2 className="text-3xl font-black text-blue-700 mb-4">
        {t('game_r1_title1')}
      </h2>
      
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl mb-4"
      >
        🚀
      </motion.div>

      <div className="bg-white p-6 rounded-3xl shadow-xl mb-6 border-2 border-blue-200">
        <p className="text-2xl leading-snug text-gray-800 text-left">
          {t('game_r1_text1')}
        </p>
      </div>

      <p className="text-lg font-medium text-blue-600 mb-6">
        {!hasRecorded ? t('game_r1_instr1') : t('game_r1_success1')}
      </p>

      {!hasRecorded ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? finishRecording : startRecording}
          disabled={isSaving}
          className={`relative ${
            isRecording
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          } text-white px-10 py-6 rounded-full shadow-xl transition-all`}
        >
          {isRecording ? (
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Square className="w-8 h-8 fill-white" />
              </motion.div>
              <span className="text-xl font-black uppercase tracking-wide">{t('game_r1_btn_stop')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Mic className="w-8 h-8" />
              <span className="text-xl font-black uppercase tracking-wide">{t('game_r1_btn_start')}</span>
            </div>
          )}

          {isRecording && (
            <motion.div
              className="absolute inset-0 border-2 border-white rounded-full"
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>
      ) : (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-black px-10 py-6 rounded-full shadow-xl"
        >
          {t('game_r1_btn_next')}
        </motion.button>
      )}
    </div>,

    // Reading 2
    <div key="reading2" className="text-center max-w-2xl mx-auto px-4">
      <h2 className="text-3xl font-black text-blue-700 mb-4">
        {t('game_r1_title2')}
      </h2>
      
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="text-6xl mb-4"
      >
        🌍
      </motion.div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-3xl shadow-xl mb-6 border-2 border-green-200">
        <p className="text-2xl leading-snug text-gray-800">
          {t('game_r1_text2')}
        </p>
      </div>

      <p className="text-lg font-medium text-blue-600 mb-6">
        {!hasRecorded ? t('game_r1_instr2') : t('game_r1_success2')}
      </p>

      {!hasRecorded ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? finishRecording : startRecording}
          disabled={isSaving}
          className={`relative ${
            isRecording
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          } text-white px-10 py-6 rounded-full shadow-xl transition-all`}
        >
          {isRecording ? (
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Square className="w-8 h-8 fill-white" />
              </motion.div>
              <span className="text-xl font-black uppercase tracking-wide">{t('game_r1_btn_stop')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Mic className="w-8 h-8" />
              <span className="text-xl font-black uppercase tracking-wide">{t('game_r1_btn_start')}</span>
            </div>
          )}
        </motion.button>
      ) : (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-black px-10 py-6 rounded-full shadow-xl"
        >
          {t('game_r1_btn_complete')}
        </motion.button>
      )}
    </div>,
  ];

  return (
    <div className="relative">
      <motion.div
        key={currentGame}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {games[currentGame]}
      </motion.div>

      {/* Space background stars - Reduced count for performance and visual clarity at zoom */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300 text-xs"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ⭐
          </motion.div>
        ))}
      </div>
    </div>
  );
}