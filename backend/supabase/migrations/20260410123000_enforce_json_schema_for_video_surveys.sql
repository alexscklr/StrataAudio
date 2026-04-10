CREATE EXTENSION IF NOT EXISTS pg_jsonschema WITH SCHEMA extensions;

-- survey_responses is now reserved for video survey submissions only.
-- A future end survey should use its own dedicated table and schema.
ALTER TABLE "public"."survey_responses"
    DROP CONSTRAINT IF EXISTS "survey_responses_survey_type_check";

ALTER TABLE "public"."survey_responses"
    DROP COLUMN IF EXISTS "survey_type";

ALTER TABLE "public"."survey_responses"
    ADD CONSTRAINT "survey_responses_video_config_required_check"
    CHECK ("config_id" IS NOT NULL) NOT VALID,
    ADD CONSTRAINT "survey_responses_video_payload_schema_check"
    CHECK (
        extensions.jsonb_matches_schema(
            '{
              "type": "object",
              "additionalProperties": false,
              "required": ["survey_id", "answers"],
              "properties": {
                "survey_id": {
                  "type": "string",
                  "const": "video-survey"
                },
                "answers": {
                  "type": "object",
                  "additionalProperties": false,
                  "required": [
                    "sync-1",
                    "sync-2",
                    "experience-1",
                    "experience-2",
                    "sus-1",
                    "sus-2",
                    "sus-3",
                    "sus-4",
                    "ueq-1",
                    "ueq-2",
                    "ueq-3",
                    "ueq-4",
                    "ueq-5",
                    "nps-1",
                    "feedback-1"
                  ],
                  "properties": {
                    "sync-1": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "sync-2": { "type": "string", "enum": ["Ja", "Nein"] },
                    "experience-1": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "experience-2": { "type": "string", "enum": ["Standard", "Mixer"] },
                    "sus-1": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "sus-2": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "sus-3": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "sus-4": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "ueq-1": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "ueq-2": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "ueq-3": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "ueq-4": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "ueq-5": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "nps-1": { "type": "integer", "minimum": 1, "maximum": 10 },
                    "feedback-1": { "type": "string", "maxLength": 4000 }
                  }
                }
              }
            }'::json,
            "responses"
        )
    ) NOT VALID;

ALTER TABLE "public"."audio_configurations"
    ADD CONSTRAINT "audio_configurations_total_interactions_nonnegative_check"
    CHECK ("total_interactions" IS NULL OR "total_interactions" >= 0) NOT VALID,
    ADD CONSTRAINT "audio_configurations_time_to_mix_ms_nonnegative_check"
    CHECK ("time_to_mix_ms" IS NULL OR "time_to_mix_ms" >= 0) NOT VALID,
    ADD CONSTRAINT "audio_configurations_final_settings_schema_check"
    CHECK (
        extensions.jsonb_matches_schema(
            '{
              "type": "object",
              "additionalProperties": false,
              "required": ["masterVolume", "isMasterMuted", "trackstates"],
              "properties": {
                "masterVolume": { "type": "number", "minimum": 0, "maximum": 1 },
                "isMasterMuted": { "type": "boolean" },
                "trackstates": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": ["volume", "isMuted"],
                    "properties": {
                      "volume": { "type": "number", "minimum": 0, "maximum": 1 },
                      "isMuted": { "type": "boolean" }
                    }
                  }
                }
              }
            }'::json,
            "final_settings"
        )
    ) NOT VALID,
    ADD CONSTRAINT "audio_configurations_interaction_log_schema_check"
    CHECK (
        extensions.jsonb_matches_schema(
            '{
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["t", "label", "val"],
                "properties": {
                  "t": { "type": "number", "minimum": 0 },
                  "label": { "type": "string", "minLength": 1, "maxLength": 128 },
                  "val": {
                    "anyOf": [
                      { "type": "number" },
                      { "type": "boolean" }
                    ]
                  }
                }
              }
            }'::json,
            "interaction_log"
        )
    ) NOT VALID;
