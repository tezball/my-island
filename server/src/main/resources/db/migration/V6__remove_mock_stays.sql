-- The numbered stays were a diagonal of invented pins, not places in those counties.
delete from lot
where stay_id in (
  select id from stay where description = 'A small stay on the island.'
);

delete from stay
where description = 'A small stay on the island.';
