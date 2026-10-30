alter table account drop constraint account_role_check;
alter table account add constraint account_role_check
  check (role in ('guest', 'host', 'admin', 'supplier'));

alter table experience add column supplier_id bigint references account(id);
alter table experience add column hidden boolean not null default true;

insert into account (email, password_hash, role)
select 'supplier-kayak@example.com', password_hash, 'supplier'
from account where email = 'guest@example.com';

insert into account (email, password_hash, role)
select 'supplier-bike@example.com', password_hash, 'supplier'
from account where email = 'guest@example.com';

update experience
set supplier_id = (select id from account where email = 'supplier-kayak@example.com'),
    hidden = false
where id = 'kayak-cork';

update experience
set supplier_id = (select id from account where email = 'supplier-bike@example.com'),
    hidden = true
where id = 'bike-galway';
