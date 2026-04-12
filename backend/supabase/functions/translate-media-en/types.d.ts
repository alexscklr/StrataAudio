declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export function createClient(
    url: string,
    key: string,
    options?: {
      auth?: {
        persistSession?: boolean;
      };
    }
  ): {
    from(table: string): {
      update(values: Record<string, unknown>): {
        eq(column: string, value: string): Promise<{ error: { message: string } | null }>;
      };
    };
  };
}
