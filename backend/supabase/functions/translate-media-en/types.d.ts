declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  type SupabaseResponse<T> = Promise<{ data: T | null; error: { message: string } | null }>;

  export function createClient(
    url: string,
    key: string,
    options?: {
      auth?: {
        persistSession?: boolean;
      };
      global?: {
        headers?: Record<string, string>;
      };
    }
  ): {
    auth: {
      getUser(): SupabaseResponse<{ user: unknown | null }>;
    };
    rpc(functionName: string, params?: Record<string, unknown>): Promise<{ error: { message: string } | null }>;
    storage: {
      from(bucket: string): {
        createSignedUploadUrl(path: string): SupabaseResponse<{ token: string }>;
      };
    };
    from(table: string): {
      insert(values: Record<string, unknown> | Array<Record<string, unknown>>): {
        select(columns?: string): {
          single(): SupabaseResponse<Record<string, unknown>>;
        };
      };
      update(values: Record<string, unknown>): {
        eq(column: string, value: string): Promise<{ error: { message: string } | null }>;
      };
    };
  };
}
