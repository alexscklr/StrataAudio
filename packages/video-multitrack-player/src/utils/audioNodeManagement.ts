interface AudioNodes {
  sourceNode: MediaElementAudioSourceNode;
  pannerNode: StereoPannerNode;
  gainNode: GainNode;
}

interface MasterNodes {
  masterPannerNode: StereoPannerNode;
  masterGainNode: GainNode;
}

let masterPannerNodeInstance: StereoPannerNode | null = null;
let masterGainNodeInstance: GainNode | null = null;
let audioNodesMap = new WeakMap<HTMLAudioElement, AudioNodes>();

export function getOrCreateMasterNodes(audioContext: AudioContext): MasterNodes {
  if (masterPannerNodeInstance && masterGainNodeInstance) {
    return { masterPannerNode: masterPannerNodeInstance, masterGainNode: masterGainNodeInstance };
  }

  masterPannerNodeInstance = audioContext.createStereoPanner();
  masterGainNodeInstance = audioContext.createGain();
  masterGainNodeInstance.gain.value = 1.0;

  masterPannerNodeInstance.connect(masterGainNodeInstance);
  masterGainNodeInstance.connect(audioContext.destination);

  return { masterPannerNode: masterPannerNodeInstance, masterGainNode: masterGainNodeInstance };
}

export function createTrackAudioNodes(
  audioElement: HTMLAudioElement,
  audioContext: AudioContext,
): AudioNodes {
  if (audioNodesMap.has(audioElement)) {
    return audioNodesMap.get(audioElement)!;
  }

  const sourceNode = audioContext.createMediaElementSource(audioElement);
  const pannerNode = audioContext.createStereoPanner();
  const gainNode = audioContext.createGain();

  const { masterPannerNode } = getOrCreateMasterNodes(audioContext);
  sourceNode.connect(pannerNode);
  pannerNode.connect(gainNode);
  gainNode.connect(masterPannerNode);

  const nodes: AudioNodes = { sourceNode, pannerNode, gainNode };
  audioNodesMap.set(audioElement, nodes);

  return nodes;
}

export function getMasterPannerNode(): StereoPannerNode | null {
  return masterPannerNodeInstance;
}

export function resetAudioNodes(): void {
  masterPannerNodeInstance = null;
  masterGainNodeInstance = null;
  audioNodesMap = new WeakMap<HTMLAudioElement, AudioNodes>();
}

export type { AudioNodes, MasterNodes };
