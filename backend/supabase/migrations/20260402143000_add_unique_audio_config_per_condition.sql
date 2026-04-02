-- Ensure a participant can store only one audio configuration per video and condition
ALTER TABLE "public"."audio_configurations"
    ADD CONSTRAINT "audio_configurations_unique_participant_video_condition"
    UNIQUE ("participant_id", "video_id", "test_condition");