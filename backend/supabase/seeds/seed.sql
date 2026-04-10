INSERT INTO videos (id, title, description, hls_url, thumbnail_url, genre, is_mandatory, duration_seconds) VALUES
('67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Test Video 1', 'This is a sample video for testing purposes.', 'output_video.m3u8', 'thumbnail.png', 'test', false, 14),
('78ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'SCOUTs Journey', 'This is a short film with 3d animation.', 'stream_0/playlist.m3u8', 'thumbnail.png', 'short film', true, 147),
('89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'OBS Recording Test', 'This is a short clip of me playing Solitaire with multiple Audiotracks', 'stream_0/playlist.m3u8', 'thumbnail.png', 'gaming', false, 36);

INSERT INTO audios (id, video_id, title, hls_url, type, icon_url, default_volume) VALUES
('d1b2c3e4-5678-90ab-cdef-1234567890ab', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Test Audio 1', 'output_audio1.m3u8', 'voice', 'microphone.png', 0.3),
('d1b2c3e4-5678-90ab-cdef-1234567890ac', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Test Audio 2', 'output_audio2.m3u8', 'music', 'music.png', 0.7),
('d1b2c3e4-5678-90ab-cdef-1234567890ad', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Test Audio 3', 'output_audio3.m3u8', 'voice chat', 'phone.png', 0.5),
('d1b2c3e4-5678-90ab-cdef-1234567890ae', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Test Audio 4', 'output_audio4.m3u8', 'game sound', 'game.png', 0.5),

('e1b2c3e4-5678-90ab-cdef-1234567890aa', '78ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Background Music', 'stream_1/playlist.m3u8', 'music', 'music.png', 1),
('e1b2c3e4-5678-90ab-cdef-1234567890ab', '78ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Robot Motions', 'stream_2/playlist.m3u8', 'motion', 'phone.png', 1),
('e1b2c3e4-5678-90ab-cdef-1234567890ac', '78ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'SFX', 'stream_3/playlist.m3u8', 'sound effects', 'sfx.png', 1),

('f1b2c3e4-5678-90ab-cdef-1234567890ab', '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Game', 'stream_2/playlist.m3u8', 'game sound', 'game.png', 1),
('f1b2c3e4-5678-90ab-cdef-1234567890ac', '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Background Music', 'stream_3/playlist.m3u8', 'music', 'music.png', 1),
('f1b2c3e4-5678-90ab-cdef-1234567890ae', '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Voice', 'stream_4/playlist.m3u8', 'voice', 'microphone.png', 1);