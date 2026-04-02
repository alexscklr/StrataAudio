CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DO $$ BEGIN CREATE TYPE test_condition_type AS ENUM ('mixer', 'preset');
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
-- participants table
CREATE TABLE IF NOT EXISTS "public"."participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamptz DEFAULT now(),
    "user_hash" "text" NOT NULL,
    "browser_name" "text",
    "browser_version" "text",
    "os_name" "text",
    "os_version" "text",
    "screen_res_width" "int4",
    "screen_res_height" "int4",
    PRIMARY KEY ("id")
);
ALTER TABLE "public"."participants" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert to participants" ON "public"."participants" FOR
INSERT WITH CHECK (true);
-- demographics table
CREATE TABLE IF NOT EXISTS "public"."demographics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "participant_id" "uuid" NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    "audio_experience" text NOT NULL CHECK (
        audio_experience IN ('layperson', 'amateur', 'professional')
    ),
    "playback_device" text NOT NULL CHECK (
        playback_device IN (
            'over-ear',
            'in-ear',
            'speakers',
            'laptop-speakers'
        )
    ),
    "hearing_impairment" boolean DEFAULT false NOT NULL,
    "age_group" "text" CHECK (
        age_group IN ('<18', '18-24', '25-34', '35-44', '45-54', '55+')
    ),
    "gender" "text" CHECK (
        gender in (
            'male',
            'female',
            'non-binary',
            'prefer not to say'
        )
    ),
    "created_at" timestamptz DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "one_demographics_per_participant" UNIQUE (participant_id)
);
ALTER TABLE "public"."demographics" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert to demographics" ON "public"."demographics" FOR
INSERT WITH CHECK (true);
-- videos table
CREATE TABLE IF NOT EXISTS "public"."videos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "hls_url" "text" NOT NULL,
    "thumbnail_url" "text",
    "genre" "text",
    "created_at" timestamptz DEFAULT now(),
    PRIMARY KEY ("id")
);
ALTER TABLE "public"."videos" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to videos" ON "public"."videos" FOR
SELECT USING (true);
-- media table
CREATE TABLE IF NOT EXISTS "public"."audios" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "video_id" "uuid" NOT NULL REFERENCES "public"."videos"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "hls_url" text NOT NULL,
    "type" text NOT NULL,
    "icon_url" text,
    "default_volume" float4 DEFAULT 1.0,
    PRIMARY KEY ("id")
);
ALTER TABLE "public"."audios" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to audios" ON "public"."audios" FOR
SELECT USING (true);
-- audio_configurations table
CREATE TABLE IF NOT EXISTS "public"."audio_configurations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() PRIMARY KEY,
    "participant_id" "uuid" NOT NULL REFERENCES "public"."participants"("id") ON DELETE CASCADE,
    "video_id" "uuid" NOT NULL REFERENCES "public"."videos"("id"),
    -- 'mixer' (manuell) oder 'preset' (vordefiniert)
    "test_condition" "test_condition_type" NOT NULL,
    -- Finaler Zustand der Regler (z.B. {"vocals": -3, "music": -15, "fx": -10})
    "final_settings" "jsonb" NOT NULL DEFAULT '{}'::jsonb,
    -- Deine Idee: Array von Zeitpunkten & Aktionen
    -- Format: [{"t": 1500, "label": "vocals", "val": -5}, ...]
    "interaction_log" "jsonb" NOT NULL DEFAULT '[]'::jsonb,
    -- Metriken für die kognitive Last (Cognitive Load)
    "total_interactions" int4 DEFAULT 0,
    "time_to_mix_ms" int4,
    -- Dauer vom Start bis zum 'Confirm'
    "created_at" timestamptz DEFAULT now()
);
ALTER TABLE "public"."audio_configurations" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert to audio_configurations" ON "public"."audio_configurations" FOR
INSERT WITH CHECK (true);
-- survey_responses table
CREATE TABLE IF NOT EXISTS "public"."survey_responses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() PRIMARY KEY,
    "participant_id" "uuid" NOT NULL REFERENCES "public"."participants"("id") ON DELETE CASCADE,
    
    -- Optional: Verknüpfung zur Config (nur bei Einzelbewertung)
    "config_id" "uuid" REFERENCES "public"."audio_configurations"("id"),
    
    -- Typ der Umfrage: 'single' (nach Video) oder 'final' (ganz am Ende)
    "survey_type" text NOT NULL CHECK (survey_type IN ('single', 'final')),
    
    -- Die Antworten als JSONB (macht dich flexibel für verschiedene Fragen)
    -- Vorteil: Du kannst Likert-Skalen (1-7) einfach als Key-Value speichern
    "responses" "jsonb" NOT NULL,
    
    -- Ein Freitext-Feld für qualitativen Input (sehr wichtig für Diskussion in Thesis!)
    "feedback_text" text,
    
    "created_at" timestamptz DEFAULT now()
);
ALTER TABLE "public"."survey_responses" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert to survey_responses" ON "public"."survey_responses" FOR
INSERT WITH CHECK (true);