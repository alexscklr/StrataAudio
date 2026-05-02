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