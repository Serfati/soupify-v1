create table public.metadata
(
    user_id  INTEGER NOT NULL REFERENCES public.users (id),
    favs     INTEGER[],
    watched  INTEGER[],
    personal INTEGER[],
    meal     INTEGER[],
    family   INTEGER[]
);
alter table public.metadata
    owner to soupify;

insert into metadata(user_id, favs, watched, personal, meal)
values ('1', ARRAY [1,2,3], ARRAY [3,4,5], ARRAY [5,6], ARRAY [6,7,8,9]);

