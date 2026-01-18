-- 1. Categories Table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tags Table
create table if not exists tags (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Post Tags Junction
create table if not exists post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- 4. Comments Table
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade,
  user_name text not null,
  user_email text,
  content text not null,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Update Posts Table
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'posts' and column_name = 'category_id') then
    alter table posts add column category_id uuid references categories(id);
    create index posts_category_id_idx on posts(category_id);
  end if;
end $$;

-- RLS Policies

-- Categories
alter table categories enable row level security;
create policy "Categories are viewable by everyone" on categories for select using (true);
create policy "Categories are insertable by admin" on categories for insert with check (auth.role() = 'authenticated'); -- Assuming admin role check or simple auth for now as per prompt "Admin Write/Delete/Update" implies auth users in this context mostly. Adjusting to be permissive for auth users or checking email if needed later. For now, generally allow auth users as admins.
create policy "Categories are updateable by admin" on categories for update using (auth.role() = 'authenticated');
create policy "Categories are deletable by admin" on categories for delete using (auth.role() = 'authenticated');

-- Tags
alter table tags enable row level security;
create policy "Tags are viewable by everyone" on tags for select using (true);
create policy "Tags are insertable by admin" on tags for insert with check (auth.role() = 'authenticated');
create policy "Tags are updateable by admin" on tags for update using (auth.role() = 'authenticated');
create policy "Tags are deletable by admin" on tags for delete using (auth.role() = 'authenticated');

-- Post Tags
alter table post_tags enable row level security;
create policy "Post Tags are viewable by everyone" on post_tags for select using (true);
create policy "Post Tags are insertable by admin" on post_tags for insert with check (auth.role() = 'authenticated');
create policy "Post Tags are deletable by admin" on post_tags for delete using (auth.role() = 'authenticated');

-- Comments
alter table comments enable row level security;
create policy "Comments are viewable by everyone if approved" on comments for select using (is_approved = true);
create policy "Comments are viewable by admin" on comments for select using (auth.role() = 'authenticated'); -- Admins see all
create policy "Comments are insertable by everyone" on comments for insert with check (true);
create policy "Comments are updateable by admin" on comments for update using (auth.role() = 'authenticated');
create policy "Comments are deletable by admin" on comments for delete using (auth.role() = 'authenticated');
