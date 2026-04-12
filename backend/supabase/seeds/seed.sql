INSERT INTO video_genres (id, label_de, label_en) VALUES
('test', 'Test', NULL),
('short_film', 'Kurzfilm', NULL),
('gaming', 'Gaming', NULL)
ON CONFLICT (id) DO UPDATE
SET
	label_de = EXCLUDED.label_de,
	label_en = EXCLUDED.label_en;

INSERT INTO audio_types (id, label_de, label_en) VALUES
('voice', 'Sprache', NULL),
('music', 'Musik', NULL),
('voice_chat', 'Sprachchat', NULL),
('game_sound', 'Spielsound', NULL),
('motion', 'Bewegung', NULL),
('sound_effects', 'Soundeffekte', NULL)
ON CONFLICT (id) DO UPDATE
SET
	label_de = EXCLUDED.label_de,
	label_en = EXCLUDED.label_en;

INSERT INTO videos (id, hls_url, thumbnail_url, genre_id, is_mandatory, duration_seconds) VALUES
('67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'output_video.m3u8', 'thumbnail.webp', 'test', false, 14),
('78ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_0/playlist.m3u8', 'thumbnail.webp', 'short_film', true, 147),
('89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_0/playlist.m3u8', 'thumbnail.webp', 'gaming', false, 36);

INSERT INTO video_contents (video_id, title_de, title_en, description_de, description_en) VALUES
('67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Testvideo 1', NULL, 'Dies ist ein Beispielvideo fuer Testzwecke.', NULL),
('78ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'SCOUTs Reise', NULL, 'Dies ist ein Kurzfilm mit 3D-Animation.', NULL),
('89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'OBS-Aufnahmetest', NULL, 'Dies ist ein kurzer Clip von Solitaire mit mehreren Audiotracks.', NULL);

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

INSERT INTO audio_contents (audio_id, title_de, title_en) VALUES
('d1b2c3e4-5678-90ab-cdef-1234567890ab', 'Testaudio 1', NULL),
('d1b2c3e4-5678-90ab-cdef-1234567890ac', 'Testaudio 2', NULL),
('d1b2c3e4-5678-90ab-cdef-1234567890ad', 'Testaudio 3', NULL),
('d1b2c3e4-5678-90ab-cdef-1234567890ae', 'Testaudio 4', NULL),
('e1b2c3e4-5678-90ab-cdef-1234567890aa', 'Hintergrundmusik', NULL),
('e1b2c3e4-5678-90ab-cdef-1234567890ab', 'Roboterbewegungen', NULL),
('e1b2c3e4-5678-90ab-cdef-1234567890ac', 'Soundeffekte', NULL),
('f1b2c3e4-5678-90ab-cdef-1234567890ab', 'Spiel', NULL),
('f1b2c3e4-5678-90ab-cdef-1234567890ac', 'Hintergrundmusik', NULL),
('f1b2c3e4-5678-90ab-cdef-1234567890ae', 'Sprache', NULL);