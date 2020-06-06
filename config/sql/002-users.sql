create table public.users
(
    id         serial       not null
        constraint users_pk primary key,
    login      VARCHAR(50)  not null,
    password   VARCHAR(200) not null,
    role       VARCHAR(50) default 'Client',
    avatar     text,
    fullname   VARCHAR(50),
    is_blocked boolean,
    email      VARCHAR(50),
    country    VARCHAR(50)
        constraint role_enum check (role in ('Admin', 'Client', 'Reviewer', 'Chef')),
    question   VARCHAR(50),
    answer     VARCHAR(50)
);

alter table public.users
    owner to soupify;

create unique index users_login_uindex
    on public.users (login);

insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('nshimmans0', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/voluptatempariaturearum.png?size=120x120&set=set1', 'Nerta Shimmans', true,
        'nshimmans0@spiegel.de', 'China', 'What is the name of your first pet?', 'ANTIBACTERIAL FOAMING');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('mduffree1', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/consequaturdoloreea.png?size=120x120&set=set1', 'Myranda Duffree', true,
        'mduffree1@marketwatch.com', 'Palestinian Territory', 'What elementary school did you attend?',
        'Dr. Super Khan');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('agemnett2', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/doloresidnumquam.png?size=120x120&set=set1', 'Alexander Gemnett', true,
        'agemnett2@senate.gov', 'Indonesia', 'What elementary school did you attend?', 'Finasteride');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('itorbett3', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Reviewer',
        'https://robohash.org/rerumminimanihil.png?size=120x120&set=set1', 'Igor Torbett', true, 'itorbett3@ibm.com',
        'Russia', 'What is the name of your first pet?', 'PREP AND PRIME');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('dpitchford4', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/estlaborequae.png?size=120x120&set=set1', 'Desdemona Pitchford', false,
        'dpitchford4@wordpress.org', 'Canada', 'What was your first car?', 'DR DEEP SKINTONER');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('alantoph5', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/doloribustotamrerum.png?size=120x120&set=set1', 'Arney Lantoph', true,
        'alantoph5@diigo.com', 'Indonesia', 'What is the name of the town where you were born?', 'Flex Power Cream');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('tlace6', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/autvoluptatumqui.png?size=120x120&set=set1', 'Terri Lace', true, 'tlace6@wikispaces.com',
        'China', 'What was your first car?', 'Ceftazidime');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('jdohrmann7', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Reviewer',
        'https://robohash.org/dolorteneturbeatae.png?size=120x120&set=set1', 'Jelene Dohrmann', false,
        'jdohrmann7@usgs.gov', 'Cuba', 'What is your mother''s maiden name?', 'Tri-Estarylla');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('thoggins8', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/voluptatevelitomnis.png?size=120x120&set=set1', 'Thibaut Hoggins', true,
        'thoggins8@usgs.gov', 'Uruguay', 'What elementary school did you attend?', 'Pravastatin Sodium');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('mpetriello9', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/quodveritatisqui.png?size=120x120&set=set1', 'Morna Petriello', true,
        'mpetriello9@live.com', 'Philippines', 'What was your first car?', 'ribavirin');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('cbrilona', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Reviewer',
        'https://robohash.org/officianumquamitaque.png?size=120x120&set=set1', 'Chrissy Brilon', false,
        'cbrilona@spiegel.de', 'China', 'What was your first car?', 'Nalbuphine Hydrochloride');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('dtregidgob', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/laudantiumpariatursoluta.png?size=120x120&set=set1', 'Diahann Tregidgo', false,
        'dtregidgob@tinypic.com', 'Greece', 'What is your mother''s maiden name?', 'Sodium Chloride');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('apeerc', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/voluptassolutaest.png?size=120x120&set=set1', 'Artemis Peer', true, 'apeerc@behance.net',
        'Philippines', 'What elementary school did you attend?', 'Childrens Ibuprofen');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('rcomerd', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/utquiset.png?size=120x120&set=set1', 'Reynolds Comer', false, 'rcomerd@skype.com',
        'Portugal', 'What is your mother''s maiden name?', 'Cymbalta');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('pklesle', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/consecteturautenim.png?size=120x120&set=set1', 'Perl Klesl', false, 'pklesle@last.fm',
        'China', 'What is the name of your first pet?', 'Nitrostat');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('cvannsf', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/enimestet.png?size=120x120&set=set1', 'Codee Vanns', true, 'cvannsf@bloomberg.com',
        'Morocco', 'What elementary school did you attend?', 'Solar Sense Clear Zinc Body SPF 50');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('raismang', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/atquenonvitae.png?size=120x120&set=set1', 'Rusty Aisman', false, 'raismang@answers.com',
        'Indonesia', 'What was your first car?', 'Lady Speed Stick');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('sbartlomieczakh', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/voluptateminquod.png?size=120x120&set=set1', 'Sergent Bartlomieczak', false,
        'sbartlomieczakh@addthis.com', 'Russia', 'What was your first car?', 'Ciclopirox');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('tottewilli', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/illumidtenetur.png?size=120x120&set=set1', 'Tobit Ottewill', false,
        'tottewilli@discovery.com', 'Chile', 'What was your first car?', 'Minoxidil');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('etallowj', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/estrerumminima.png?size=120x120&set=set1', 'Emmalee Tallow', false, 'etallowj@tmall.com',
        'China', 'What was your first car?', 'Colds and Cough');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('fvank', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/consequaturreiciendisea.png?size=120x120&set=set1', 'Flossy Van Merwe', false,
        'fvank@ibm.com', 'Russia', 'What is the name of the town where you were born?', 'Trimethoprim');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('ethomtsonl', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/laboriosamvoluptatemeum.png?size=120x120&set=set1', 'Eula Thomtson', false,
        'ethomtsonl@hp.com', 'Iran', 'What is the name of your first pet?', 'Sheer Cover Mineral Foundation');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('amcmillanm', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Reviewer',
        'https://robohash.org/eaquidemut.png?size=120x120&set=set1', 'Annamaria McMillan', false,
        'amcmillanm@cbsnews.com', 'China', 'What elementary school did you attend?', 'Hydroxyzine Pamoate');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('mbriatn', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/ipsamvelvoluptatibus.png?size=120x120&set=set1', 'Marchall Briat', true,
        'mbriatn@state.tx.us', 'Russia', 'What was your first car?', 'Anti-Diarrheal');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('ifebreo', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/quassitaperiam.png?size=120x120&set=set1', 'Idette Febre', false, 'ifebreo@squidoo.com',
        'Democratic Republic of the Congo', 'What is the name of the town where you were born?', 'Lopid');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('rcudworthp', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Reviewer',
        'https://robohash.org/solutaetrerum.png?size=120x120&set=set1', 'Remington Cudworth', true,
        'rcudworthp@huffingtonpost.com', 'Zambia', 'What was your first car?', 'Quality Choice');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('gcorkittq', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/necessitatibusverolabore.png?size=120x120&set=set1', 'Gabriello Corkitt', false,
        'gcorkittq@slashdot.org', 'China', 'What is your mother''s maiden name?', 'CHILDRENS ADVIL');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('icaserir', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/ipsamnamdolores.png?size=120x120&set=set1', 'Ines Caseri', false,
        'icaserir@friendfeed.com', 'Uzbekistan', 'What is the name of your first pet?', 'Nicotine Transdermal System');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('ncowelys', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/expeditautrerum.png?size=120x120&set=set1', 'Neda Cowely', true,
        'ncowelys@statcounter.com', 'Indonesia', 'What is your mother''s maiden name?', 'Green Pepper');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('idet', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/nisiestvelit.png?size=120x120&set=set1', 'Ivette De Domenico', true, 'idet@storify.com',
        'Indonesia', 'What is the name of the town where you were born?', 'Rizatriptan Benzoate');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('cimasonu', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/molestiasteneturest.png?size=120x120&set=set1', 'Carlynne Imason', true,
        'cimasonu@nps.gov', 'Malaysia', 'What is the name of the town where you were born?',
        'ROPINIROLE HYDROCHLORIDE');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('rgraynev', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/consequaturquisquamdolores.png?size=120x120&set=set1', 'Rice Grayne', true,
        'rgraynev@google.de', 'Yemen', 'What elementary school did you attend?', 'Stool Softener');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('kausiellow', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/eligendietvoluptas.png?size=120x120&set=set1', 'Kathy Ausiello', false,
        'kausiellow@google.ca', 'Panama', 'What is your mother''s maiden name?', 'Clarithromycin');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('mlaurantx', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/aspernatursinteos.png?size=120x120&set=set1', 'Minetta Laurant', true,
        'mlaurantx@printfriendly.com', 'China', 'What is your mother''s maiden name?', 'Sertraline Hydrochloride');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('mlydiatey', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/autinnumquam.png?size=120x120&set=set1', 'Millie Lydiate', true, 'mlydiatey@salon.com',
        'Indonesia', 'What elementary school did you attend?', 'LenzaPatch');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('ywhittekz', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/namutnon.png?size=120x120&set=set1', 'Yolanthe Whittek', false,
        'ywhittekz@stumbleupon.com', 'South Korea', 'What is your mother''s maiden name?', 'ORTHO GUARD');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('csemken10', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/quasinequeomnis.png?size=120x120&set=set1', 'Courtney Semken', false, 'csemken10@irs.gov',
        'Sweden', 'What is your mother''s maiden name?', 'ibuprofen cold and sinus');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('bdounbare11', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/pariaturautmaiores.png?size=120x120&set=set1', 'Bel Dounbare', false,
        'bdounbare11@tuttocitta.it', 'Brazil', 'What is your mother''s maiden name?', 'Desipramine Hydrochloride');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('triccard12', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Reviewer',
        'https://robohash.org/voluptasofficiaqui.png?size=120x120&set=set1', 'Tannie Riccard', true,
        'triccard12@omniture.com', 'Dominica', 'What is the name of the town where you were born?', 'Natures Gate');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('jcrosio13', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/inesteos.png?size=120x120&set=set1', 'Jayme Crosio', true, 'jcrosio13@google.pl',
        'Canada', 'What elementary school did you attend?', 'Peanut');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('drowcliffe14', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/maioresomnisdolorem.png?size=120x120&set=set1', 'Dallis Rowcliffe', false,
        'drowcliffe14@shareasale.com', 'China', 'What was your first car?',
        'Food - Fish and Shellfish, Crab Xiphosurus sowerbyi');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('llygoe15', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/maioresmollitiavoluptas.png?size=120x120&set=set1', 'Ly Lygoe', true,
        'llygoe15@theguardian.com', 'Russia', 'What is the name of the town where you were born?', 'Topcare Nicotine');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('ldudbridge16', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/beataedoloremqueanimi.png?size=120x120&set=set1', 'Leslie Dudbridge', true,
        'ldudbridge16@disqus.com', 'Gambia', 'What is the name of the town where you were born?', 'Enalapril Maleate');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('mwoolston17', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Reviewer',
        'https://robohash.org/velitmolestiasquas.png?size=120x120&set=set1', 'Moritz Woolston', false,
        'mwoolston17@flavors.me', 'Indonesia', 'What elementary school did you attend?', 'Treatment Set TS348490');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('spittendreigh18', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Reviewer',
        'https://robohash.org/fugiatarchitectosoluta.png?size=120x120&set=set1', 'Sid Pittendreigh', true,
        'spittendreigh18@mediafire.com', 'Comoros', 'What is the name of your first pet?', 'TRAMADOL HYDROCHLORIDE');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('gbarlee19', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Reviewer',
        'https://robohash.org/etsuntnisi.png?size=120x120&set=set1', 'Gaultiero Barlee', false, 'gbarlee19@ted.com',
        'Sweden', 'What is your mother''s maiden name?', 'Cough');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('kmcgrudder1a', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/etaliasautem.png?size=120x120&set=set1', 'Kissiah McGrudder', false,
        'kmcgrudder1a@yellowbook.com', 'Croatia', 'What is the name of your first pet?', 'Formaldehyde');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('darmand1b', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Chef',
        'https://robohash.org/illumsimiliqueipsum.png?size=120x120&set=set1', 'Deena Armand', true, 'darmand1b@home.pl',
        'China', 'What is your mother''s maiden name?', 'Wal Phed');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('lemer1c', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Admin',
        'https://robohash.org/ullamiureexpedita.png?size=120x120&set=set1', 'Lanna Emer', true, 'lemer1c@dion.ne.jp',
        'Syria', 'What elementary school did you attend?', 'CENTER-AL - BROMUS INERMIS POLLEN');
insert into users (login, password, role, avatar, fullname, is_blocked, email, country, question, answer)
values ('nmepsted1d', '$2b$10$hBagmts7uhkzcBxaErg4/ekTNeFxwvviUu3/DB.1d8nm0NkDbwPe2', 'Client',
        'https://robohash.org/repellendusetveritatis.png?size=120x120&set=set1', 'Nessa Mepsted', false,
        'nmepsted1d@ebay.com', 'Bosnia and Herzegovina', 'What is the name of your first pet?',
        'cough and sore throat');