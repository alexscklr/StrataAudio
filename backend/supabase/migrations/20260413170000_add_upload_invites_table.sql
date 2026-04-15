CREATE TABLE IF NOT EXISTS "public"."upload_invites" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "token_hash" text NOT NULL UNIQUE,
    "label" text,
    "max_uses" int4,
    "use_count" int4 NOT NULL DEFAULT 0,
    "expires_at" timestamptz,
    "created_by" uuid REFERENCES "auth"."users"("id"),
    "created_at" timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE "public"."upload_invites" ENABLE ROW LEVEL SECURITY;
