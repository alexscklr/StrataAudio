INSERT INTO videos (id, title, description, hls_url, thumbnail_url, genre) VALUES
('67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Test Video 1', 'This is a sample video for testing purposes.', 'output_video.m3u8', 'thumbnail.png', 'test');

INSERT INTO audios (id, video_id, title, hls_url, type, icon_url) VALUES
('d1b2c3e4-5678-90ab-cdef-1234567890ab', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Test Audio 1', 'output_audio1.m3u8', 'voice', 'microphone.png'),
('d1b2c3e4-5678-90ab-cdef-1234567890ac', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Test Audio 2', 'output_audio2.m3u8', 'music', 'music.png'),
('d1b2c3e4-5678-90ab-cdef-1234567890ad', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Test Audio 3', 'output_audio3.m3u8', 'voice chat', 'phone.png'),
('d1b2c3e4-5678-90ab-cdef-1234567890ae', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Test Audio 4', 'output_audio4.m3u8', 'game sound', 'game.png');