"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Upload, Check, Loader2 } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";

interface Level3Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level3WritingWizard({ onComplete, onProgress }: Level3Props) {
  const { t } = useTranslation();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.url) throw new Error(data.error || "Upload failed");

      const sessionId = localStorage.getItem("sessionId");
      await fetch("/api/session/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          payload: { test3_image: data.url }
        })
      });

    } catch (error) {
      console.error("Error saving image:", error);
      alert(t('game_w1_error'));
      setUploadedImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    // Ensure the UI scrolls back to top if zoomed/scrolled before completing
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    onProgress(1);
    
    // Slight delay to allow the "Success" state to be seen before transition
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div className="text-center max-w-2xl mx-auto px-4 py-2 min-h-[60vh] flex flex-col justify-center">
      <h2 className="text-3xl font-black text-purple-700 mb-4">
        {t('game_w1_title')}
      </h2>
      
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-6xl mb-4"
      >
        🧙‍♂️
      </motion.div>

      <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-3xl shadow-xl mb-6 border-2 border-purple-300">
        <div className="bg-white p-4 rounded-xl shadow-inner mb-4">
          <p className="text-xl text-gray-800 leading-tight font-medium italic whitespace-pre-line">
            {t('game_w1_text')}
          </p>
        </div>
        <p className="text-lg text-purple-700 font-bold">
          {t('game_w1_instr')}
        </p>
      </div>

      {!uploadedImage ? (
        <div className="relative">
          <label
            htmlFor="file-upload"
            className={`cursor-pointer inline-block ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-full shadow-xl"
            >
              <div className="flex items-center gap-3">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8" />
                )}
                <span className="text-xl font-black uppercase">
                  {isUploading ? t('game_w1_btn_uploading') : t('game_w1_btn_upload')}
                </span>
              </div>
            </motion.div>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <p className="text-gray-500 mt-4 text-sm font-semibold">
            {t('game_w1_upload_hint')}
          </p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="bg-gradient-to-br from-green-100 to-teal-100 p-4 rounded-2xl shadow-md border-2 border-green-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Check className="w-6 h-6 text-green-600" />
              <p className="text-lg font-bold text-green-700">{t('game_w1_ready')}</p>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-inner overflow-hidden relative inline-block">
              <img
                src={uploadedImage}
                alt="Uploaded preview"
                className="max-h-40 mx-auto rounded-lg shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isUploading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl font-black px-12 py-5 rounded-full shadow-xl disabled:opacity-50"
            >
              {t('game_w1_btn_submit')}
            </motion.button>

            <label htmlFor="file-upload-replace" className="cursor-pointer">
              <span className="text-gray-500 text-sm font-bold underline">{t('game_w1_try_again')}</span>
            </label>
            <input
              id="file-upload-replace"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        </motion.div>
      )}

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-200 text-2xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, delay: i }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  );
}