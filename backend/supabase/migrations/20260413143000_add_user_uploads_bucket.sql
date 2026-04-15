insert into storage.buckets (id, name, public)
values ('user_uploads', 'user_uploads', false)
on conflict (id) do nothing;
