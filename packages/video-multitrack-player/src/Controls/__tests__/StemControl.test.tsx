import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import StemControl from '../StemControl';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('StemControl', () => {
  const baseProps = {
    audio: {
      id: 'stem-1',
      title: 'Drums',
      hls_url: 'drums.m3u8',
      icon_url: 'drums.svg',
      default_volume: 1,
    },
    isAudioControlsOpen: true,
    trackState: {
      volume: 0.6,
      isMuted: false,
      pan: 0,
    },
    onVolumeChange: vi.fn(),
    onVolumeCommit: vi.fn(),
    onPanChange: vi.fn(),
    onPanCommit: vi.fn(),
    onToggleMute: vi.fn(),
    resolvePublicUrl: (path: string) => `https://cdn.example.com/${path}`,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls volume and pan handlers when sliders change', () => {
    const { container } = render(<StemControl {...baseProps} />);

    const volumeSlider = container.querySelector('#slider-stem-1') as HTMLInputElement;
    const panSlider = container.querySelector('#pan-slider-stem-1') as HTMLInputElement;

    fireEvent.change(volumeSlider, { target: { value: '0.75' } });
    fireEvent.mouseUp(volumeSlider, { currentTarget: { value: '0.75' } });

    fireEvent.change(panSlider, { target: { value: '0.3' } });
    fireEvent.mouseUp(panSlider, { currentTarget: { value: '0.3' } });

    expect(baseProps.onVolumeChange).toHaveBeenCalledWith('stem-1', 0.75);
    expect(baseProps.onVolumeCommit).toHaveBeenCalledWith('stem-1', 0.6);
    expect(baseProps.onPanChange).toHaveBeenCalledWith('stem-1', 0.3);
    expect(baseProps.onPanCommit).toHaveBeenCalledWith('stem-1', 0);
  });

  it('calls mute toggle when icon button is clicked', () => {
    render(<StemControl {...baseProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'player.trackVolume' }));

    expect(baseProps.onToggleMute).toHaveBeenCalledWith('stem-1');
  });
});
