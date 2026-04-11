"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, Loader2, Pause } from "lucide-react";

interface LivePreviewProps {
  title?: string;
  text: string;
  voice?: "female" | "male";
  language?: string; // "en" | "pt" | "es"
}

/**
 * Live AI preview card — shows what the Ringa receptionist would say
 * given the current onboarding inputs. Uses the browser's built-in
 * speech synthesis API for playback (free, works offline, no API key needed).
 *
 * Note: this is a demo voice from the user's OS. The real Ringa AI in
 * production uses ElevenLabs natural voices via Vapi.
 */
export function LivePreview({
  title = "What Ringa will say",
  text,
  voice = "female",
  language = "en",
}: LivePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
    }
    // Stop any in-flight speech when text or component unmounts
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speech if text changes while playing
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const langMap: Record<string, string> = {
    en: "en-US",
    pt: "pt-BR",
    es: "es-MX",
  };

  const speak = () => {
    if (!isSupported || !text) return;

    // If already playing, stop.
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langMap[language] || "en-US";
    utter.rate = 1.0;
    utter.pitch = voice === "female" ? 1.1 : 0.9;

    // Try to find a matching voice on the user's device
    const voices = window.speechSynthesis.getVoices();
    const matching = voices.find(
      (v) =>
        v.lang.startsWith(langMap[language]?.slice(0, 2) || "en") &&
        (voice === "female" ? !/male/i.test(v.name) : /male|deep/i.test(v.name))
    );
    if (matching) utter.voice = matching;

    utter.onstart = () => setIsPlaying(true);
    utter.onend = () => setIsPlaying(false);
    utter.onerror = () => setIsPlaying(false);

    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-[#3B6FFF]/5 to-[#7C3FFF]/5 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 items-center justify-center">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {title}
          </span>
        </div>
        {isSupported && (
          <button
            onClick={speak}
            disabled={!text}
            className="flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-medium text-[#3B6FFF] hover:border-[#3B6FFF]/40 disabled:opacity-50 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="h-3 w-3" />
                Listen
              </>
            )}
          </button>
        )}
      </div>

      <div className="mt-3 rounded-xl bg-white border border-gray-100 p-4">
        <div className="flex items-start gap-3">
          {/* Avatar with pulse ring */}
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3B6FFF] to-[#7C3FFF] text-white text-sm font-bold">
              R
            </div>
            {isPlaying && (
              <div className="absolute inset-0 rounded-full border-2 border-[#3B6FFF] animate-ping" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-400">Ringa AI</p>
            <p className="mt-0.5 text-sm text-gray-800 leading-relaxed">
              {text || <span className="italic text-gray-400">Fill in the form to see what Ringa will say…</span>}
            </p>
          </div>
        </div>
      </div>

      {!isSupported && (
        <p className="mt-2 text-[11px] text-gray-400 text-center">
          Audio playback not supported in this browser
        </p>
      )}
    </div>
  );
}
