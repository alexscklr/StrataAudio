export const toggleFullscreen = (containerElement: HTMLElement | null) => {
  if (!containerElement) return;

  if (!document.fullscreenElement) {
    containerElement.requestFullscreen().catch((err) => {
      console.error(`Fehler beim Aktivieren von Fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};