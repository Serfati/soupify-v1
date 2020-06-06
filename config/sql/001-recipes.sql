numcreate
table public.recipes
(
    id serial not null
    constraint recipes_pk primary key,
    title varchar (100) not null,
    ready_in_minutes integer,
    aggregate_likes integer,
    serving integer,
    vegetarian boolean,
    vegan boolean,
    gluten_free boolean,
    image text,
    instructions text,
    extended_ingredients text
);

alter table public.recipes
    owner to soupify;
