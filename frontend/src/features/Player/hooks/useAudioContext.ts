import { useCallback, useEffect, useRef, useState } from "react";
import {
  getOrCreateAudioContext,
  closeAudioContext,
} from "../contexts/audioContext";
import {
  type AudioNodes,
  createTrackAudioNodes,
  getOrCreateMasterNodes,
  getMasterPannerNode,
  resetAudioNodes,
} from "../utils/audioNodeManagement";

interface AudioContextProps {
  audioContext: AudioContext | null;
  isAudioContextReady: boolean;
  createAudioNodes: (audioElement: HTMLAudioElement) => AudioNodes;
  masterPannerNode: StereoPannerNode | null;
}

export function useAudioContext(): AudioContextProps {
  const [isAudioContextReady, setIsAudioContextReady] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      const ctx = getOrCreateAudioContext();
      audioContextRef.current = ctx;
      getOrCreateMasterNodes(ctx);

      const handleStateChange = () => {
        setIsAudioContextReady(ctx.state === "running");
      };

      ctx.addEventListener("statechange", handleStateChange);
      setIsAudioContextReady(ctx.state === "running");

      return () => {
        ctx.removeEventListener("statechange", handleStateChange);
      };
    } catch (error) {
      console.error("Failed to initialize AudioContext:", error);
      setIsAudioContextReady(false);
    }
  }, []);

  const createAudioNodes = useCallback(
    (audioElement: HTMLAudioElement): AudioNodes => {
      if (!audioContextRef.current) {
        throw new Error("AudioContext not initialized");
      }
      return createTrackAudioNodes(audioElement, audioContextRef.current);
    },
    [],
  );

  return {
    audioContext: audioContextRef.current,
    isAudioContextReady,
    createAudioNodes,
    masterPannerNode: getMasterPannerNode(),
  };
}

export function resetAudioContext() {
  closeAudioContext();
  resetAudioNodes();
}

export type { AudioContextProps };
export type { AudioNodes } from "../utils/audioNodeManagement";;
