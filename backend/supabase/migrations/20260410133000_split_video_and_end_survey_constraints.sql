CREATE EXTENSION IF NOT EXISTS pg_jsonschema WITH SCHEMA extensions;

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
                    "experience-2": { "type": "string", "enum": ["Standard", "Mixer"] }
                  }
                }
              }
            }'::json,
            "responses"
        )
    ) NOT VALID;

CREATE TABLE IF NOT EXISTS "public"."end_survey_responses" (
    "id" uuid DEFAULT "gen_random_uuid"() PRIMARY KEY,
    "participant_id" uuid NOT NULL REFERENCES "public"."participants"("id") ON DELETE CASCADE,
    "responses" jsonb NOT NULL,
    "created_at" timestamptz DEFAULT now()
);

ALTER TABLE "public"."end_survey_responses" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert to end_survey_responses"
ON "public"."end_survey_responses"
FOR INSERT
WITH CHECK (true);

ALTER TABLE "public"."end_survey_responses"
    ADD CONSTRAINT "end_survey_responses_unique_participant"
    UNIQUE ("participant_id");

ALTER TABLE "public"."end_survey_responses"
    ADD CONSTRAINT "end_survey_responses_payload_schema_check"
    CHECK (
        extensions.jsonb_matches_schema(
            '{
              "type": "object",
              "additionalProperties": false,
              "required": ["survey_id", "answers"],
              "properties": {
                "survey_id": {
                  "type": "string",
                  "const": "endSurvey"
                },
                "answers": {
                  "type": "object",
                  "additionalProperties": false,
                  "required": [
                    "sus-1",
                    "sus-2",
                    "sus-3",
                    "sus-4",
                    "ueq-1",
                    "ueq-2",
                    "ueq-3",
                    "ueq-4",
                    "ueq-5",
                    "nps-1"
                  ],
                  "properties": {
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
