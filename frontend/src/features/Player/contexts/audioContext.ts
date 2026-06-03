let audioContextInstance: AudioContext | null = null;

export function getOrCreateAudioContext(): AudioContext {
  if (audioContextInstance) {
    return audioContextInstance;
  }

  audioContextInstance = new (
    window.AudioContext || (window as any).webkitAudioContext
  )();

  const resumeAudioContext = () => {
    if (audioContextInstance && audioContextInstance.state === "suspended") {
      audioContextInstance.resume().catch(() => {});
    }
    document.removeEventListener("click", resumeAudioContext);
    document.removeEventListener("keydown", resumeAudioContext);
  };

  document.addEventListener("click", resumeAudioContext);
  document.addEventListener("keydown", resumeAudioContext);

  return audioContextInstance;
}

export function closeAudioContext(): void {
  if (audioContextInstance) {
    audioContextInstance.close().catch(() => {});
    audioContextInstance = null;
  }
}

function getAudioContext(): AudioContext | null {
  return audioContextInstance;
}
