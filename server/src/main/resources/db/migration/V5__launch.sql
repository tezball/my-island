alter table stay add column saved_by_person boolean not null default false;
alter table experience add column saved_by_person boolean not null default false;

-- Same 1x1 PNG as Kerry glamping 001. A seeded stay is published only when this
-- file, plain text, and a pin on the island are all present, and website is empty.
-- One title in four (004, 008, ...) is left without a photo, so the bar keeps it hidden.
update stay
set image = decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'),
    image_type = 'image/png'
where saved_by_person = false
  and title ~ ' [0-9]{3}$'
  and title !~ '^Load camp [0-9]+$'
  and substring(title from '([0-9]{3})$')::int % 4 <> 0
  and lat between 51.0 and 55.5
  and lng between -11.0 and -5.0
  and position('<' in title) = 0
  and position('<' in description) = 0
  and title !~* 'script'
  and description !~* 'script'
  and coalesce(website, '') = '';

update experience
set image = decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'),
    image_type = 'image/png'
where id = 'kayak-cork'
  and saved_by_person = false
  and lat between 51.0 and 55.5
  and lng between -11.0 and -5.0
  and position('<' in name) = 0
  and position('<' in description) = 0
  and name !~* 'script'
  and description !~* 'script';

update stay
set hidden = false
where saved_by_person = false
  and title ~ ' [0-9]{3}$'
  and title !~ '^Load camp [0-9]+$'
  and image is not null
  and image_type in ('image/png', 'image/jpeg')
  and lat between 51.0 and 55.5
  and lng between -11.0 and -5.0
  and position('<' in title) = 0
  and position('<' in description) = 0
  and title !~* 'script'
  and description !~* 'script'
  and coalesce(website, '') = '';

update stay
set hidden = true
where title ~ '^Load camp [0-9]+$'
   or (
     saved_by_person = false
     and title ~ ' [0-9]{3}$'
     and title !~ '^Load camp [0-9]+$'
     and (
       image is null
       or coalesce(image_type, '') not in ('image/png', 'image/jpeg')
       or lat is null or lng is null
       or lat < 51.0 or lat > 55.5
       or lng < -11.0 or lng > -5.0
       or position('<' in title) > 0
       or position('<' in description) > 0
       or title ~* 'script'
       or description ~* 'script'
       or coalesce(website, '') <> ''
     )
   );

update experience
set hidden = false
where id = 'kayak-cork'
  and saved_by_person = false
  and image is not null
  and image_type in ('image/png', 'image/jpeg')
  and lat between 51.0 and 55.5
  and lng between -11.0 and -5.0
  and position('<' in name) = 0
  and position('<' in description) = 0
  and name !~* 'script'
  and description !~* 'script';

update experience
set hidden = true
where id = 'kayak-cork'
  and saved_by_person = false
  and (
    image is null
    or coalesce(image_type, '') not in ('image/png', 'image/jpeg')
    or lat is null or lng is null
    or lat < 51.0 or lat > 55.5
    or lng < -11.0 or lng > -5.0
    or position('<' in name) > 0
    or position('<' in description) > 0
    or name ~* 'script'
    or description ~* 'script'
  );

update experience
set hidden = true
where saved_by_person = false
  and id in ('bike-galway', 'boat-antrim');
