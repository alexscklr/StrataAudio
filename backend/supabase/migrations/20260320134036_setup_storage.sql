insert into storage.buckets (id, name, public)
values ('videos', 'videos', true);
create policy "Allow public read access to videos bucket" on storage.objects for
select using (bucket_id = 'videos');
insert into storage.buckets (id, name, public)
values ('system', 'system', true);
create policy "Allow public read access to system bucket" on storage.objects for
select using (bucket_id = 'system');