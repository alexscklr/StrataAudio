INSERT INTO video_genres (id, label) VALUES
('test', 'test'),
('short_film', 'short film'),
('gaming', 'gaming')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

INSERT INTO audio_types (id, label) VALUES
('voice', 'voice'),
('music', 'music'),
('voice_chat', 'voice chat'),
('game_sound', 'game sound'),
('motion', 'motion'),
('sound_effects', 'sound effects')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

INSERT INTO videos (id, hls_url, thumbnail_url, genre_id, is_mandatory, duration_seconds) VALUES
('67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'output_video.m3u8', 'thumbnail.png', 'test', false, 14),
('78ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_0/playlist.m3u8', 'thumbnail.png', 'short_film', true, 147),
('89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_0/playlist.m3u8', 'thumbnail.png', 'gaming', false, 36);

INSERT INTO video_contents (video_id, title, description) VALUES
('67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Test Video 1', 'This is a sample video for testing purposes.'),
('78ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'SCOUTs Journey', 'This is a short film with 3d animation.'),
('89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'OBS Recording Test', 'This is a short clip of me playing Solitaire with multiple Audiotracks');

INSERT INTO audios (id, video_id, hls_url, audio_type_id, icon_url, default_volume) VALUES
('d1b2c3e4-5678-90ab-cdef-1234567890ab', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'output_audio1.m3u8', 'voice', 'microphone.png', 0.3),
('d1b2c3e4-5678-90ab-cdef-1234567890ac', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'output_audio2.m3u8', 'music', 'music.png', 0.7),
('d1b2c3e4-5678-90ab-cdef-1234567890ad', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'output_audio3.m3u8', 'voice_chat', 'phone.png', 0.5),
('d1b2c3e4-5678-90ab-cdef-1234567890ae', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'output_audio4.m3u8', 'game_sound', 'game.png', 0.5),

('e1b2c3e4-5678-90ab-cdef-1234567890aa', '78ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_1/playlist.m3u8', 'music', 'music.png', 1),
('e1b2c3e4-5678-90ab-cdef-1234567890ab', '78ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_2/playlist.m3u8', 'motion', 'phone.png', 1),
('e1b2c3e4-5678-90ab-cdef-1234567890ac', '78ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_3/playlist.m3u8', 'sound_effects', 'sfx.png', 1),

('f1b2c3e4-5678-90ab-cdef-1234567890ab', '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_2/playlist.m3u8', 'game_sound', 'game.png', 1),
('f1b2c3e4-5678-90ab-cdef-1234567890ac', '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_3/playlist.m3u8', 'music', 'music.png', 1),
('f1b2c3e4-5678-90ab-cdef-1234567890ae', '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_4/playlist.m3u8', 'voice', 'microphone.png', 1);

INSERT INTO audio_contents (audio_id, title) VALUES
('d1b2c3e4-5678-90ab-cdef-1234567890ab', 'Test Audio 1'),
('d1b2c3e4-5678-90ab-cdef-1234567890ac', 'Test Audio 2'),
('d1b2c3e4-5678-90ab-cdef-1234567890ad', 'Test Audio 3'),
('d1b2c3e4-5678-90ab-cdef-1234567890ae', 'Test Audio 4'),
('e1b2c3e4-5678-90ab-cdef-1234567890aa', 'Background Music'),
('e1b2c3e4-5678-90ab-cdef-1234567890ab', 'Robot Motions'),
('e1b2c3e4-5678-90ab-cdef-1234567890ac', 'SFX'),
('f1b2c3e4-5678-90ab-cdef-1234567890ab', 'Game'),
('f1b2c3e4-5678-90ab-cdef-1234567890ac', 'Background Music'),
('f1b2c3e4-5678-90ab-cdef-1234567890ae', 'Voice');