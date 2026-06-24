# @strata/video-multitrack-player

Reusable React video player with multitrack audio mixer.

## What It Includes

- HLS video playback
- Multitrack stem playback synced to the video timeline
- Mixer controls per stem: volume, pan, mute
- Master controls: volume and pan
- Overlay transport controls (play/pause, seek, fullscreen)

## Installation

```bash
npm install @strata/video-multitrack-player
```

Peer dependencies required in the consuming app:

- `react`
- `react-dom`
- `react-i18next`
- `react-icons`

## Required CSS Import

Import package styles once in your app entrypoint:

```ts
import '@strata/video-multitrack-player/styles.css';
```

If this import is missing, controls and mixer layout will look broken.

## Basic Usage

```tsx
import { VideoPlayer } from '@strata/video-multitrack-player';
import '@strata/video-multitrack-player/styles.css';

<VideoPlayer
  videoId="video-123"
  videoUrl="https://cdn.example.com/video-123/master.m3u8"
  title="Sample Video"
  audios={[
    { id: 'stem-1', title: 'Drums', hls_url: 'audio/drums.m3u8', default_volume: 1 },
    { id: 'stem-2', title: 'Bass', hls_url: 'audio/bass.m3u8', default_volume: 1 },
  ]}
  watchMode="mixer"
/>
```

## Types

The package exports typed namespaces for UI and core domain models:

```tsx
import { VideoPlayer, type VideoPlayerProps, PlayerCore } from '@strata/video-multitrack-player';

type Audio = PlayerCore.Audio;
type WatchMode = PlayerCore.VideoWatchMode;
```

`VideoPlayerProps` is publicly exported for wrapper components and strongly typed integration.

## Public URL Resolver

Use `resolvePublicUrl` when your media and icon URLs need app-specific mapping.

```tsx
<VideoPlayer
  ...
  resolvePublicUrl={(path, bucket) => {
    const base = bucket === 'system' ? 'https://assets.example.com' : 'https://media.example.com';
    return `${base}/${path}`;
  }}
/>
```

## Mixer-Only Without Midpoint Switch

Midpoint switching is not enforced by this package.
It is controlled by your app logic.

To run mixer-only mode:

- Set `watchMode="mixer"`
- Do not implement a midpoint mode switch in the consuming app

## Framework Compatibility

- Native support: React projects
- Angular/Vue/etc.: use a wrapper bridge (for example Web Component or React microfrontend)

## Development (inside this repository)

```bash
cd packages/video-multitrack-player
npm install
npm run check
npm run test
npm run build
```

## Versioning and Releases

The package uses Changesets for release notes and SemVer updates.

```bash
cd packages/video-multitrack-player
npm run changeset
npm run version-package
```

CI validates:

- Typecheck
- Tests
- Build
- Changeset status on pull requests
