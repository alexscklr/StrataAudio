CREATE EXTENSION IF NOT EXISTS pg_jsonschema WITH SCHEMA extensions;

COMMENT ON COLUMN "public"."audio_configurations"."final_settings" IS
'JSONB containing: masterVolume (0-1), masterPan (-1 to 1), isMasterMuted (bool), trackstates ({volume, pan, isMuted})';

COMMENT ON COLUMN "public"."audio_configurations"."interaction_log" IS
'JSONB array of {t: timestamp_ms, label: string (volume, pan, mute events), val: number|bool}';

ALTER TABLE "public"."survey_responses"
    DROP CONSTRAINT IF EXISTS "survey_responses_video_payload_schema_check";

ALTER TABLE "public"."survey_responses"
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
                    "experience-2"
                  ],
                  "properties": {
                    "sync-1": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "sync-2": { "type": "string", "enum": ["Ja", "Nein"] },
                    "experience-1": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "experience-2": { "type": "string", "enum": ["Standard", "Mixer"] },
                    "pan-1": { "type": "integer", "minimum": 1, "maximum": 7 },
                    "pan-2": { "type": "integer", "minimum": 1, "maximum": 7 }
                  }
                }
              }
            }'::json,
            "responses"
        )
    ) NOT VALID;

ALTER TABLE "public"."audio_configurations"
    DROP CONSTRAINT IF EXISTS "audio_configurations_final_settings_schema_check";

ALTER TABLE "public"."audio_configurations"
    ADD CONSTRAINT "audio_configurations_final_settings_schema_check"
    CHECK (
        extensions.jsonb_matches_schema(
            '{
              "type": "object",
              "additionalProperties": false,
              "required": ["masterVolume", "isMasterMuted", "trackstates"],
              "properties": {
                "masterVolume": { "type": "number", "minimum": 0, "maximum": 1 },
                "masterPan": { "type": "number", "minimum": -1, "maximum": 1 },
                "isMasterMuted": { "type": "boolean" },
                "trackstates": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": ["volume", "isMuted"],
                    "properties": {
                      "volume": { "type": "number", "minimum": 0, "maximum": 1 },
                      "isMuted": { "type": "boolean" },
                      "pan": { "type": "number", "minimum": -1, "maximum": 1 }
                    }
                  }
                }
              }
            }'::json,
            "final_settings"
        )
    ) NOT VALID;