import { act, renderHook } from '@testing-library/react';
import useMixer from '../useMixer';

describe('useMixer', () => {
  const audios = [
    { id: 'drums', title: 'Drums', hls_url: 'drums.m3u8', default_volume: 0.9 },
    { id: 'bass', title: 'Bass', hls_url: 'bass.m3u8', default_volume: 0.7 },
  ];

  it('initializes track states from audio defaults', () => {
    const { result } = renderHook(() => useMixer(audios));

    expect(result.current.mixerState.trackstates.drums.volume).toBe(0.9);
    expect(result.current.mixerState.trackstates.bass.volume).toBe(0.7);
  });

  it('updates volume, mute and pan and computes effective values', () => {
    const { result } = renderHook(() => useMixer(audios));

    act(() => {
      result.current.handleVolumeChange('drums', 0.5);
      result.current.handleMasterVolumeChange(0.8);
      result.current.handlePanChange('drums', 2);
      result.current.handleMuteToggle('drums');
    });

    expect(result.current.mixerState.trackstates.drums.volume).toBe(0.5);
    expect(result.current.mixerState.trackstates.drums.pan).toBe(1);
    expect(result.current.mixerState.trackstates.drums.isMuted).toBe(true);

    expect(result.current.calculateEffectiveVolume('drums')).toBe(0);
    expect(result.current.calculateEffectivePan('drums')).toBe(0);
  });

  it('records interactions in snapshot on commit', () => {
    const { result } = renderHook(() => useMixer(audios));

    act(() => {
      result.current.handleVolumeCommit('drums', 0.55);
      result.current.handlePanCommit('drums', -0.25);
      result.current.handleMasterVolumeCommit(0.88);
    });

    const snapshot = result.current.getAudioConfigurationSnapshot();

    expect(snapshot.total_interactions).toBe(3);
    expect(snapshot.interaction_log).toHaveLength(3);
    expect(snapshot.interaction_log[0].label).toBe('drums.volume');
    expect(snapshot.interaction_log[1].label).toBe('drums.pan');
    expect(snapshot.interaction_log[2].label).toBe('master.volume');
  });
});
