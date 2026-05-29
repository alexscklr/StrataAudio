INSERT INTO video_genres (id, label_de, label_en) VALUES
('test', 'Test', NULL),
('short_film', 'Kurzfilm', NULL),
('gaming', 'Gaming', NULL)
ON CONFLICT (id) DO UPDATE
SET
	label_de = EXCLUDED.label_de,
	label_en = EXCLUDED.label_en;

INSERT INTO videos (id, hls_url, thumbnail_url, genre_id, is_mandatory, duration_seconds) VALUES
('67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'output_video.m3u8', 'thumbnail.webp', 'test', false, 14),
('797b40c6-fd6f-4de8-b13d-b63d4e94ff58', 'stream_0/playlist.m3u8', 'thumbnail.webp', 'short_film', true, 147),
('89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_0/playlist.m3u8', 'thumbnail.webp', 'gaming', false, 36);

INSERT INTO video_contents (video_id, title_de, title_en, description_de, description_en) VALUES
('67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'Testvideo 1', NULL, 'Dies ist ein Beispielvideo fuer Testzwecke.', NULL),
('797b40c6-fd6f-4de8-b13d-b63d4e94ff58', 'SCOUTs Reise', NULL, 'Dies ist ein Kurzfilm mit 3D-Animation.', NULL),
('89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'OBS-Aufnahmetest', NULL, 'Dies ist ein kurzer Clip von Solitaire mit mehreren Audiotracks.', NULL);

INSERT INTO icons (file_name, source_name, source_url, author_name, author_url) VALUES
('microphone.png', 'Flaticon', 'https://www.flaticon.com/', 'Unknown', NULL),
('music.png', 'Flaticon', 'https://www.flaticon.com/', 'Unknown', NULL),
('phone.png', 'Flaticon', 'https://www.flaticon.com/', 'Unknown', NULL),
('game.png', 'Flaticon', 'https://www.flaticon.com/', 'Unknown', NULL),
('sfx.png', 'Flaticon', 'https://www.flaticon.com/', 'Unknown', NULL)
ON CONFLICT (file_name) DO UPDATE
SET
	source_name = EXCLUDED.source_name,
	source_url = EXCLUDED.source_url,
	author_name = EXCLUDED.author_name,
	author_url = EXCLUDED.author_url;

INSERT INTO audios (id, video_id, hls_url, icon_url, default_volume) VALUES
('d1b2c3e4-5678-90ab-cdef-1234567890ab', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'output_audio1.m3u8', 'microphone.png', 0.3),
('d1b2c3e4-5678-90ab-cdef-1234567890ac', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'output_audio2.m3u8', 'music.png', 0.7),
('d1b2c3e4-5678-90ab-cdef-1234567890ad', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'output_audio3.m3u8', 'phone.png', 0.5),
('d1b2c3e4-5678-90ab-cdef-1234567890ae', '67ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'output_audio4.m3u8', 'game.png', 0.5),

('e1b2c3e4-5678-90ab-cdef-1234567890aa', '797b40c6-fd6f-4de8-b13d-b63d4e94ff58', 'stream_1/playlist.m3u8', 'music.png', 1),
('e1b2c3e4-5678-90ab-cdef-1234567890ab', '797b40c6-fd6f-4de8-b13d-b63d4e94ff58', 'stream_2/playlist.m3u8', 'phone.png', 1),
('e1b2c3e4-5678-90ab-cdef-1234567890ac', '797b40c6-fd6f-4de8-b13d-b63d4e94ff58', 'stream_3/playlist.m3u8', 'sfx.png', 1),

('f1b2c3e4-5678-90ab-cdef-1234567890ab', '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_2/playlist.m3u8', 'game.png', 1),
('f1b2c3e4-5678-90ab-cdef-1234567890ac', '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_3/playlist.m3u8', 'music.png', 1),
('f1b2c3e4-5678-90ab-cdef-1234567890ae', '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17', 'stream_4/playlist.m3u8', 'microphone.png', 1);

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

-- Test auth user for local login:
-- email: test@strataaudio.local
-- password: test
INSERT INTO auth.users (
	id,
	instance_id,
	aud,
	role,
	email,
	encrypted_password,
	email_confirmed_at,
	confirmation_token,
	recovery_token,
	email_change_token_new,
	email_change,
	email_change_token_current,
	phone,
	phone_change,
	reauthentication_token,
	created_at,
	updated_at,
	raw_app_meta_data,
	raw_user_meta_data,
	is_sso_user,
	is_anonymous
) VALUES (
	'9f0b6b8f-a4ee-4d5f-8951-4c3b5af667e1',
	'00000000-0000-0000-0000-000000000000',
	'authenticated',
	'authenticated',
	'test@strataaudio.local',
	crypt('test', gen_salt('bf')),
	now(),
	'',
	'',
	'',
	'',
	'',
	'',
	'',
	'',
	now(),
	now(),
	'{"provider":"email","providers":["email"]}',
	'{}',
	false,
	false
)
ON CONFLICT (id) DO UPDATE
SET
	email = EXCLUDED.email,
	encrypted_password = EXCLUDED.encrypted_password,
	email_confirmed_at = EXCLUDED.email_confirmed_at,
	confirmation_token = EXCLUDED.confirmation_token,
	recovery_token = EXCLUDED.recovery_token,
	email_change_token_new = EXCLUDED.email_change_token_new,
	email_change = EXCLUDED.email_change,
	email_change_token_current = EXCLUDED.email_change_token_current,
	phone = EXCLUDED.phone,
	phone_change = EXCLUDED.phone_change,
	reauthentication_token = EXCLUDED.reauthentication_token,
	updated_at = now(),
	raw_app_meta_data = EXCLUDED.raw_app_meta_data,
	raw_user_meta_data = EXCLUDED.raw_user_meta_data,
	is_sso_user = EXCLUDED.is_sso_user,
	is_anonymous = EXCLUDED.is_anonymous;

INSERT INTO auth.identities (
	id,
	user_id,
	identity_data,
	provider,
	provider_id,
	created_at,
	updated_at,
	last_sign_in_at
) VALUES (
	'9f0b6b8f-a4ee-4d5f-8951-4c3b5af667e1',
	'9f0b6b8f-a4ee-4d5f-8951-4c3b5af667e1',
	'{"sub":"9f0b6b8f-a4ee-4d5f-8951-4c3b5af667e1","email":"test@strataaudio.local"}',
	'email',
	'test@strataaudio.local',
	now(),
	now(),
	now()
)
ON CONFLICT (provider, provider_id) DO UPDATE
SET
	user_id = EXCLUDED.user_id,
	identity_data = EXCLUDED.identity_data,
	updated_at = now(),
	last_sign_in_at = EXCLUDED.last_sign_in_at;

-- ============================================================
-- TESTDATEN FÜR AUSWERTUNG
-- 5 Teilnehmer mit vollständigen Antworten (Demographics,
-- Audio-Konfigurationen, Video-Surveys, Abschluss-Survey).
-- 3 der 5 Teilnehmer haben zusätzlich das optionale
-- Gaming-Video (OBS-Aufnahmetest) abgeschlossen.
-- ============================================================

-- Teilnehmer
-- p1: Chrome/Linux, male, 25-34
-- p2: Firefox/Windows, female, 18-24
-- p3: Chrome/macOS, male, 35-44
-- p4: Safari/macOS, diverse, 25-34
-- p5: Chrome/Windows, female, 45-54
INSERT INTO participants (id, user_hash, browser_name, browser_version, os_name, os_version, screen_res_width, screen_res_height) VALUES
('a0000001-0000-0000-0000-000000000001', 'testhash_p1_aabbccdd', 'Chrome',  '124.0', 'Linux',   '22.04', 1920, 1080),
('a0000001-0000-0000-0000-000000000002', 'testhash_p2_bbccddee', 'Firefox', '125.0', 'Windows', '11',    1920, 1200),
('a0000001-0000-0000-0000-000000000003', 'testhash_p3_ccddeeff', 'Chrome',  '124.0', 'macOS',   '14.4',  2560, 1440),
('a0000001-0000-0000-0000-000000000004', 'testhash_p4_ddeeffgg', 'Safari',  '17.4',  'macOS',   '14.4',  2560, 1600),
('a0000001-0000-0000-0000-000000000005', 'testhash_p5_eeffgghh', 'Chrome',  '124.0', 'Windows', '10',    1366,  768)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ZUSATZDATEN FÜR ANALYSE-TESTS
-- 3 weitere Teilnehmer (p6-p8), davon 2 Widerspruchsfaelle:
-- - stark negatives Feedback/UEQ/NPS/Video
-- - gleichzeitig positives SUS
-- ============================================================

-- Teilnehmer p6-p8
INSERT INTO participants (id, user_hash, browser_name, browser_version, os_name, os_version, screen_res_width, screen_res_height) VALUES
('a0000001-0000-0000-0000-000000000006', 'testhash_p6_ffgghhii', 'Edge',   '125.0', 'Windows', '11',   1920, 1080),
('a0000001-0000-0000-0000-000000000007', 'testhash_p7_gghhiijj', 'Chrome', '125.0', 'Linux',   '22.04', 2560, 1440),
('a0000001-0000-0000-0000-000000000008', 'testhash_p8_hhiijjkk', 'Firefox','126.0', 'macOS',   '14.5', 1728, 1117)
ON CONFLICT (id) DO NOTHING;

-- Demographics p6-p8
INSERT INTO demographics (id, participant_id, streaming_usage, audio_output_type, audio_balance_disturbance, audio_settings_satisfaction, gender, age_group) VALUES
('a0000002-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000006', 'weekly',            'headphones',        2, 6, 'male',    '25_34'),
('a0000002-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000007', 'daily',             'headphones',        7, 2, 'female',  '35_44'),
('a0000002-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000008', 'multiple_per_week', 'built_in_speakers', 6, 2, 'diverse', '18_24')
ON CONFLICT (id) DO NOTHING;

-- Audio-Konfigurationen (Pflicht-Video SCOUTs Reise) fuer p6-p8
INSERT INTO audio_configurations (id, participant_id, video_id, final_settings, interaction_log, total_interactions, time_to_mix_ms) VALUES
('b0000001-0000-0000-0000-000000000009',
 'a0000001-0000-0000-0000-000000000006',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 '{
   "masterVolume": 0.95,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "e1b2c3e4-5678-90ab-cdef-1234567890aa": {"volume": 0.9, "pan":  0.1, "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 0.9, "pan":  0.0, "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 0.8, "pan": -0.1, "isMuted": false}
   }
 }',
 '[
   {"t": 6900,  "label": "volume:e1b2c3e4-5678-90ab-cdef-1234567890aa", "val": 0.9},
   {"t": 12300, "label": "pan:e1b2c3e4-5678-90ab-cdef-1234567890ac",    "val": -0.1}
 ]',
 2, 6900),

('b0000001-0000-0000-0000-000000000010',
 'a0000001-0000-0000-0000-000000000007',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 '{
   "masterVolume": 0.65,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "e1b2c3e4-5678-90ab-cdef-1234567890aa": {"volume": 0.2, "pan": 0.0, "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 0.2, "pan": 0.0, "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 0.2, "pan": 0.0, "isMuted": false}
   }
 }',
 '[
   {"t": 5200, "label": "masterVolume", "val": 0.65}
 ]',
 1, 5200),

('b0000001-0000-0000-0000-000000000011',
 'a0000001-0000-0000-0000-000000000008',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 '{
   "masterVolume": 0.7,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "e1b2c3e4-5678-90ab-cdef-1234567890aa": {"volume": 0.3, "pan": 0.0, "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 0.3, "pan": 0.0, "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 0.3, "pan": 0.0, "isMuted": false}
   }
 }',
 '[
   {"t": 6100, "label": "volume:e1b2c3e4-5678-90ab-cdef-1234567890aa", "val": 0.3}
 ]',
 1, 6100)
ON CONFLICT (id) DO NOTHING;

-- Audio-Konfigurationen (optional: OBS-Aufnahmetest) fuer Widerspruchsfaelle p7/p8
INSERT INTO audio_configurations (id, participant_id, video_id, final_settings, interaction_log, total_interactions, time_to_mix_ms) VALUES
('b0000001-0000-0000-0000-000000000012',
 'a0000001-0000-0000-0000-000000000007',
 '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17',
 '{
   "masterVolume": 0.6,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "f1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 0.2, "pan": 0.0, "isMuted": false},
     "f1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 0.2, "pan": 0.0, "isMuted": false},
     "f1b2c3e4-5678-90ab-cdef-1234567890ae": {"volume": 0.2, "pan": 0.0, "isMuted": false}
   }
 }',
 '[
   {"t": 4800, "label": "masterVolume", "val": 0.6}
 ]',
 1, 4800),

('b0000001-0000-0000-0000-000000000013',
 'a0000001-0000-0000-0000-000000000008',
 '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17',
 '{
   "masterVolume": 0.62,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "f1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 0.2, "pan": 0.0, "isMuted": false},
     "f1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 0.2, "pan": 0.0, "isMuted": false},
     "f1b2c3e4-5678-90ab-cdef-1234567890ae": {"volume": 0.2, "pan": 0.0, "isMuted": false}
   }
 }',
 '[
   {"t": 5000, "label": "masterVolume", "val": 0.62}
 ]',
 1, 5000)
ON CONFLICT (id) DO NOTHING;

-- Video-Survey: Pflicht-Video fuer p6-p8
INSERT INTO survey_responses (id, participant_id, config_id, video_id, first_watch_mode, responses) VALUES
('c0000001-0000-0000-0000-000000000009',
 'a0000001-0000-0000-0000-000000000006',
 'b0000001-0000-0000-0000-000000000009',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 'mixer',
 '{"survey_id":"video-survey","answers":{"sync-1":6,"sync-2":"Nein","experience-1":6,"experience-2":"Mixer","pan-1":5,"pan-2":5}}'),

('c0000001-0000-0000-0000-000000000010',
 'a0000001-0000-0000-0000-000000000007',
 'b0000001-0000-0000-0000-000000000010',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 'standard',
 '{"survey_id":"video-survey","answers":{"sync-1":1,"sync-2":"Ja","experience-1":1,"experience-2":"Standard","pan-1":1,"pan-2":1}}'),

('c0000001-0000-0000-0000-000000000011',
 'a0000001-0000-0000-0000-000000000008',
 'b0000001-0000-0000-0000-000000000011',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 'standard',
 '{"survey_id":"video-survey","answers":{"sync-1":1,"sync-2":"Ja","experience-1":1,"experience-2":"Standard"}}')
ON CONFLICT (id) DO NOTHING;

-- Video-Survey: optionales Video fuer p7/p8 (beide Widerspruchsfaelle)
INSERT INTO survey_responses (id, participant_id, config_id, video_id, first_watch_mode, responses) VALUES
('c0000001-0000-0000-0000-000000000012',
 'a0000001-0000-0000-0000-000000000007',
 'b0000001-0000-0000-0000-000000000012',
 '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17',
 'standard',
 '{"survey_id":"video-survey","answers":{"sync-1":1,"sync-2":"Ja","experience-1":1,"experience-2":"Standard","pan-1":1,"pan-2":1}}'),

('c0000001-0000-0000-0000-000000000013',
 'a0000001-0000-0000-0000-000000000008',
 'b0000001-0000-0000-0000-000000000013',
 '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17',
 'standard',
 '{"survey_id":"video-survey","answers":{"sync-1":1,"sync-2":"Ja","experience-1":1,"experience-2":"Standard","pan-1":1,"pan-2":1}}')
ON CONFLICT (id) DO NOTHING;

-- End-Survey p6-p8 (inkl. 2 Widerspruchsfaelle)
INSERT INTO end_survey_responses (id, participant_id, responses) VALUES
('d0000001-0000-0000-0000-000000000006',
 'a0000001-0000-0000-0000-000000000006',
 '{"survey_id":"endSurvey","answers":{"sus-1":6,"sus-2":6,"sus-3":6,"sus-4":6,"ueq-1":6,"ueq-2":6,"ueq-3":6,"ueq-4":6,"ueq-5":6,"nps-1":9,"feedback-1":"Sehr gute Kontrolle ueber den Mix."}}'),

('d0000001-0000-0000-0000-000000000007',
 'a0000001-0000-0000-0000-000000000007',
 '{"survey_id":"endSurvey","answers":{"sus-1":6,"sus-2":6,"sus-3":5,"sus-4":6,"ueq-1":1,"ueq-2":1,"ueq-3":1,"ueq-4":1,"ueq-5":1,"nps-1":1,"feedback-1":"Absolut furchtbar."}}'),

('d0000001-0000-0000-0000-000000000008',
 'a0000001-0000-0000-0000-000000000008',
 '{"survey_id":"endSurvey","answers":{"sus-1":5,"sus-2":5,"sus-3":5,"sus-4":5,"ueq-1":1,"ueq-2":1,"ueq-3":1,"ueq-4":1,"ueq-5":1,"nps-1":1,"feedback-1":"Das war absolut furchtbar fuer mich."}}')
ON CONFLICT (id) DO NOTHING;

-- Initial gesetzte Bias-Flags fuer bekannte Ausreisser
INSERT INTO participant_analysis_flags (participant_id, is_biased, reason) VALUES
('a0000001-0000-0000-0000-000000000007', true, 'Inkonsistente Bewertungen: stark negativ bei UEQ/NPS/Video, SUS jedoch positiv.'),
('a0000001-0000-0000-0000-000000000008', true, 'Inkonsistente Bewertungen ueber mehrere Surveys (manuell markiert).')
ON CONFLICT (participant_id) DO UPDATE
SET
  is_biased = EXCLUDED.is_biased,
  reason = EXCLUDED.reason;

-- Demographics
INSERT INTO demographics (id, participant_id, streaming_usage, audio_output_type, audio_balance_disturbance, audio_settings_satisfaction, gender, age_group) VALUES
('a0000002-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'daily',              'headphones',       3, 5, 'male',    '25_34'),
('a0000002-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'multiple_per_week',  'headphones',       5, 6, 'female',  '18_24'),
('a0000002-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000003', 'weekly',             'external_speakers',2, 4, 'male',    '35_44'),
('a0000002-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', 'daily',              'headphones',       6, 3, 'diverse', '25_34'),
('a0000002-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000005', 'multiple_per_month', 'built_in_speakers',4, 5, 'female',  '45_54')
ON CONFLICT (id) DO NOTHING;

-- Audio-Konfigurationen für SCOUTs Reise (797b40c6, Pflicht-Video)
-- Tracks: e1..aa=Hintergrundmusik, e1..ab=Roboterbewegungen, e1..ac=Soundeffekte
INSERT INTO audio_configurations (id, participant_id, video_id, final_settings, interaction_log, total_interactions, time_to_mix_ms) VALUES

-- p1: Musik hoch, Soundeffekte reduziert, leichtes Panning
('b0000001-0000-0000-0000-000000000001',
 'a0000001-0000-0000-0000-000000000001',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 '{
   "masterVolume": 0.85,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "e1b2c3e4-5678-90ab-cdef-1234567890aa": {"volume": 1.0,  "pan":  0.1,  "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 0.8,  "pan":  0.0,  "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 0.4,  "pan": -0.1,  "isMuted": false}
   }
 }',
 '[
   {"t": 8200,  "label": "volume:e1b2c3e4-5678-90ab-cdef-1234567890aa", "val": 1.0},
   {"t": 15400, "label": "volume:e1b2c3e4-5678-90ab-cdef-1234567890ac", "val": 0.4},
   {"t": 22100, "label": "pan:e1b2c3e4-5678-90ab-cdef-1234567890aa",    "val": 0.1},
   {"t": 31500, "label": "masterVolume",                                 "val": 0.85}
 ]',
 4, 8200),

-- p2: Ausgeglichener Mix, Standardeinstellungen weitgehend beibehalten
('b0000001-0000-0000-0000-000000000002',
 'a0000001-0000-0000-0000-000000000002',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 '{
   "masterVolume": 1.0,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "e1b2c3e4-5678-90ab-cdef-1234567890aa": {"volume": 0.9,  "pan":  0.0,  "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 0.85, "pan":  0.0,  "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 0.75, "pan":  0.0,  "isMuted": false}
   }
 }',
 '[
   {"t": 12300, "label": "volume:e1b2c3e4-5678-90ab-cdef-1234567890aa", "val": 0.9},
   {"t": 18700, "label": "volume:e1b2c3e4-5678-90ab-cdef-1234567890ab", "val": 0.85},
   {"t": 25000, "label": "volume:e1b2c3e4-5678-90ab-cdef-1234567890ac", "val": 0.75}
 ]',
 3, 12300),

-- p3: Roboterbewegungen hervorgehoben, Musik reduziert, Panning für Raumgefühl
('b0000001-0000-0000-0000-000000000003',
 'a0000001-0000-0000-0000-000000000003',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 '{
   "masterVolume": 0.9,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "e1b2c3e4-5678-90ab-cdef-1234567890aa": {"volume": 0.5,  "pan": -0.3,  "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 1.0,  "pan":  0.2,  "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 0.7,  "pan":  0.0,  "isMuted": false}
   }
 }',
 '[
   {"t": 5800,  "label": "volume:e1b2c3e4-5678-90ab-cdef-1234567890aa", "val": 0.5},
   {"t": 9200,  "label": "pan:e1b2c3e4-5678-90ab-cdef-1234567890aa",    "val": -0.3},
   {"t": 14600, "label": "volume:e1b2c3e4-5678-90ab-cdef-1234567890ab", "val": 1.0},
   {"t": 19800, "label": "pan:e1b2c3e4-5678-90ab-cdef-1234567890ab",    "val": 0.2},
   {"t": 28300, "label": "masterVolume",                                 "val": 0.9}
 ]',
 5, 5800),

-- p4: Soundeffekte stummgeschaltet, Musik ganz vorne
('b0000001-0000-0000-0000-000000000004',
 'a0000001-0000-0000-0000-000000000004',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 '{
   "masterVolume": 0.8,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "e1b2c3e4-5678-90ab-cdef-1234567890aa": {"volume": 1.0,  "pan":  0.0,  "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 0.6,  "pan":  0.0,  "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 1.0,  "pan":  0.0,  "isMuted": true}
   }
 }',
 '[
   {"t": 6500,  "label": "mute:e1b2c3e4-5678-90ab-cdef-1234567890ac",   "val": true},
   {"t": 11200, "label": "volume:e1b2c3e4-5678-90ab-cdef-1234567890ab", "val": 0.6},
   {"t": 20000, "label": "masterVolume",                                 "val": 0.8}
 ]',
 3, 6500),

-- p5: Kaum Interaktion, alles auf Standard, Master etwas reduziert
('b0000001-0000-0000-0000-000000000005',
 'a0000001-0000-0000-0000-000000000005',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 '{
   "masterVolume": 0.7,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "e1b2c3e4-5678-90ab-cdef-1234567890aa": {"volume": 1.0, "pan": 0.0, "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 1.0, "pan": 0.0, "isMuted": false},
     "e1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 1.0, "pan": 0.0, "isMuted": false}
   }
 }',
 '[
   {"t": 42000, "label": "masterVolume", "val": 0.7}
 ]',
 1, 42000)

ON CONFLICT (id) DO NOTHING;

-- Audio-Konfigurationen für OBS-Aufnahmetest (89ae997e, optionales Gaming-Video)
-- Tracks: f1..ab=Spiel, f1..ac=Hintergrundmusik, f1..ae=Sprache
INSERT INTO audio_configurations (id, participant_id, video_id, final_settings, interaction_log, total_interactions, time_to_mix_ms) VALUES

-- p1: Sprache im Vordergrund, Spiel-Audio und Musik reduziert
('b0000001-0000-0000-0000-000000000006',
 'a0000001-0000-0000-0000-000000000001',
 '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17',
 '{
   "masterVolume": 1.0,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "f1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 0.5, "pan":  0.0, "isMuted": false},
     "f1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 0.3, "pan": -0.1, "isMuted": false},
     "f1b2c3e4-5678-90ab-cdef-1234567890ae": {"volume": 1.0, "pan":  0.1, "isMuted": false}
   }
 }',
 '[
   {"t": 4100, "label": "volume:f1b2c3e4-5678-90ab-cdef-1234567890ae", "val": 1.0},
   {"t": 7600, "label": "volume:f1b2c3e4-5678-90ab-cdef-1234567890ab", "val": 0.5},
   {"t": 9900, "label": "volume:f1b2c3e4-5678-90ab-cdef-1234567890ac", "val": 0.3}
 ]',
 3, 4100),

-- p2: Musik stumm, Spiel- und Sprach-Audio gleichgewichtet
('b0000001-0000-0000-0000-000000000007',
 'a0000001-0000-0000-0000-000000000002',
 '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17',
 '{
   "masterVolume": 0.9,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "f1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 0.8, "pan": 0.0, "isMuted": false},
     "f1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 1.0, "pan": 0.0, "isMuted": true},
     "f1b2c3e4-5678-90ab-cdef-1234567890ae": {"volume": 0.8, "pan": 0.0, "isMuted": false}
   }
 }',
 '[
   {"t": 3500, "label": "mute:f1b2c3e4-5678-90ab-cdef-1234567890ac",   "val": true},
   {"t": 8200, "label": "volume:f1b2c3e4-5678-90ab-cdef-1234567890ab", "val": 0.8},
   {"t": 12400,"label": "masterVolume",                                 "val": 0.9}
 ]',
 3, 3500),

-- p3: Alles aktiv, leichte Anpassungen
('b0000001-0000-0000-0000-000000000008',
 'a0000001-0000-0000-0000-000000000003',
 '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17',
 '{
   "masterVolume": 0.85,
   "masterPan": 0.0,
   "isMasterMuted": false,
   "trackstates": {
     "f1b2c3e4-5678-90ab-cdef-1234567890ab": {"volume": 0.9, "pan":  0.0, "isMuted": false},
     "f1b2c3e4-5678-90ab-cdef-1234567890ac": {"volume": 0.6, "pan": -0.2, "isMuted": false},
     "f1b2c3e4-5678-90ab-cdef-1234567890ae": {"volume": 0.9, "pan":  0.2, "isMuted": false}
   }
 }',
 '[
   {"t": 7100,  "label": "volume:f1b2c3e4-5678-90ab-cdef-1234567890ac", "val": 0.6},
   {"t": 10500, "label": "pan:f1b2c3e4-5678-90ab-cdef-1234567890ac",    "val": -0.2},
   {"t": 16800, "label": "pan:f1b2c3e4-5678-90ab-cdef-1234567890ae",    "val": 0.2}
 ]',
 3, 7100)

ON CONFLICT (id) DO NOTHING;

-- Video-Survey-Antworten für SCOUTs Reise
-- Felder: sync-1 (1-7), sync-2 ("Ja"|"Nein"), experience-1 (1-7), experience-2 ("Standard"|"Mixer")
-- Optional: pan-1 (1-7), pan-2 (1-7)
INSERT INTO survey_responses (id, participant_id, config_id, video_id, first_watch_mode, responses) VALUES
('c0000001-0000-0000-0000-000000000001',
 'a0000001-0000-0000-0000-000000000001',
 'b0000001-0000-0000-0000-000000000001',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 'mixer',
 '{"survey_id":"video-survey","answers":{"sync-1":6,"sync-2":"Nein","experience-1":6,"experience-2":"Mixer","pan-1":5,"pan-2":4}}'),

('c0000001-0000-0000-0000-000000000002',
 'a0000001-0000-0000-0000-000000000002',
 'b0000001-0000-0000-0000-000000000002',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 'standard',
 '{"survey_id":"video-survey","answers":{"sync-1":5,"sync-2":"Nein","experience-1":5,"experience-2":"Standard","pan-1":3,"pan-2":4}}'),

('c0000001-0000-0000-0000-000000000003',
 'a0000001-0000-0000-0000-000000000003',
 'b0000001-0000-0000-0000-000000000003',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 'mixer',
 '{"survey_id":"video-survey","answers":{"sync-1":7,"sync-2":"Nein","experience-1":7,"experience-2":"Mixer","pan-1":6,"pan-2":5}}'),

('c0000001-0000-0000-0000-000000000004',
 'a0000001-0000-0000-0000-000000000004',
 'b0000001-0000-0000-0000-000000000004',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 'standard',
 '{"survey_id":"video-survey","answers":{"sync-1":4,"sync-2":"Ja","experience-1":4,"experience-2":"Mixer"}}'),

('c0000001-0000-0000-0000-000000000005',
 'a0000001-0000-0000-0000-000000000005',
 'b0000001-0000-0000-0000-000000000005',
 '797b40c6-fd6f-4de8-b13d-b63d4e94ff58',
 'standard',
 '{"survey_id":"video-survey","answers":{"sync-1":5,"sync-2":"Nein","experience-1":4,"experience-2":"Standard"}}')

ON CONFLICT (id) DO NOTHING;

-- Video-Survey-Antworten für OBS-Aufnahmetest (p1-p3)
INSERT INTO survey_responses (id, participant_id, config_id, video_id, first_watch_mode, responses) VALUES
('c0000001-0000-0000-0000-000000000006',
 'a0000001-0000-0000-0000-000000000001',
 'b0000001-0000-0000-0000-000000000006',
 '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17',
 'mixer',
 '{"survey_id":"video-survey","answers":{"sync-1":6,"sync-2":"Nein","experience-1":6,"experience-2":"Mixer","pan-1":5,"pan-2":5}}'),

('c0000001-0000-0000-0000-000000000007',
 'a0000001-0000-0000-0000-000000000002',
 'b0000001-0000-0000-0000-000000000007',
 '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17',
 'mixer',
 '{"survey_id":"video-survey","answers":{"sync-1":5,"sync-2":"Nein","experience-1":5,"experience-2":"Mixer","pan-1":4,"pan-2":3}}'),

('c0000001-0000-0000-0000-000000000008',
 'a0000001-0000-0000-0000-000000000003',
 'b0000001-0000-0000-0000-000000000008',
 '89ae997e-9b26-46f0-a8bc-9a4bd34c2b17',
 'standard',
 '{"survey_id":"video-survey","answers":{"sync-1":6,"sync-2":"Nein","experience-1":6,"experience-2":"Standard","pan-1":5,"pan-2":4}}')

ON CONFLICT (id) DO NOTHING;

-- Abschluss-Surveys (alle 5 Teilnehmer)
-- Felder: sus-1 bis sus-4 (1-7), ueq-1 bis ueq-5 (1-7), nps-1 (1-10), optional feedback-1
INSERT INTO end_survey_responses (id, participant_id, responses) VALUES
('d0000001-0000-0000-0000-000000000001',
 'a0000001-0000-0000-0000-000000000001',
 '{"survey_id":"endSurvey","answers":{"sus-1":6,"sus-2":5,"sus-3":6,"sus-4":5,"ueq-1":6,"ueq-2":5,"ueq-3":6,"ueq-4":5,"ueq-5":6,"nps-1":8,"feedback-1":"Sehr intuitiv, das Panning hat mir gut gefallen."}}'),

('d0000001-0000-0000-0000-000000000002',
 'a0000001-0000-0000-0000-000000000002',
 '{"survey_id":"endSurvey","answers":{"sus-1":5,"sus-2":4,"sus-3":5,"sus-4":4,"ueq-1":5,"ueq-2":4,"ueq-3":5,"ueq-4":4,"ueq-5":5,"nps-1":7}}'),

('d0000001-0000-0000-0000-000000000003',
 'a0000001-0000-0000-0000-000000000003',
 '{"survey_id":"endSurvey","answers":{"sus-1":7,"sus-2":6,"sus-3":7,"sus-4":6,"ueq-1":7,"ueq-2":6,"ueq-3":7,"ueq-4":6,"ueq-5":7,"nps-1":9,"feedback-1":"Toll! Der Mixer war sehr angenehm zu bedienen."}}'),

('d0000001-0000-0000-0000-000000000004',
 'a0000001-0000-0000-0000-000000000004',
 '{"survey_id":"endSurvey","answers":{"sus-1":4,"sus-2":3,"sus-3":4,"sus-4":4,"ueq-1":4,"ueq-2":3,"ueq-3":4,"ueq-4":4,"ueq-5":3,"nps-1":5,"feedback-1":"Manche Bedienelemente waren etwas verwirrend."}}'),

('d0000001-0000-0000-0000-000000000005',
 'a0000001-0000-0000-0000-000000000005',
 '{"survey_id":"endSurvey","answers":{"sus-1":5,"sus-2":5,"sus-3":5,"sus-4":4,"ueq-1":5,"ueq-2":5,"ueq-3":4,"ueq-4":5,"ueq-5":5,"nps-1":7}}')

ON CONFLICT (id) DO NOTHING;