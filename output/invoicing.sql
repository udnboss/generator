drop table if exists [account];
create table [account] (
  id text
  , label text not null
  , bank_name text not null
  , bank_address text not null
  , bank_swift text not null
  , account_name text not null
  , account_iban text not null
  , account_address text not null
  , primary key (id)
  , unique (label)
);

drop table if exists [category];
create table [category] (
  id text
  , name text not null
  , category_id text
  , primary key (id)
  , unique (name)
  , foreign key (category_id) references category(id) on delete cascade on delete cascade
);

drop table if exists [company];
create table [company] (
  id text
  , name text not null
  , address text not null
  , crn text not null
  , trn text not null
  , contact text not null
  , mobile text not null
  , email text not null
  , primary key (id)
  , unique (name)
);

drop table if exists [currency];
create table [currency] (
  id text not null
  , name text not null
  , symbol text not null
  , primary key (id)
  , unique (name)
);

drop table if exists [customer];
create table [customer] (
  id text
  , name text not null
  , address text
  , contact text
  , currency_id text
  , payment_term int
  , primary key (id)
  , unique (name)
  , foreign key (currency_id) references currency(id) on delete cascade on delete cascade
);

drop table if exists [item];
create table [item] (
  id text
  , name text not null
  , category_id text
  , primary key (id)
  , unique (name)
  , foreign key (category_id) references category(id) on delete cascade on delete cascade
);

drop table if exists [sale];
create table [sale] (
  id text
  , company_id text not null
  , account_id text not null
  , customer_id text not null
  , place text
  , number int
  , date text not null
  , currency_id text not null
  , total real not null
  , reference text
  , confirmed int not null
  , reference_date text
  , due_date text
  , primary key (id)
  , unique (number)
  , foreign key (company_id) references company(id) on delete cascade on delete cascade
  , foreign key (account_id) references account(id) on delete cascade on delete cascade
  , foreign key (customer_id) references customer(id) on delete cascade on delete cascade
  , foreign key (currency_id) references currency(id) on delete cascade on delete cascade
);

drop table if exists [saleItem];
create table [saleItem] (
  id text
  , sale_id text not null
  , item_id text not null
  , description text
  , quantity int not null
  , price real not null
  , primary key (id)
  , unique (sale_id, item_id)
  , foreign key (sale_id) references sale(id) on delete cascade on delete cascade
  , foreign key (item_id) references item(id) on delete cascade on delete cascade
);

create index ix_account_label on account (label);

create index ix_category_name on category (name);
create index ix_category_category_id on category (category_id);

create index ix_company_name on company (name);

create index ix_currency_name on currency (name);

create index ix_customer_name on customer (name);
create index ix_customer_currency_id on customer (currency_id);

create index ix_item_name on item (name);
create index ix_item_category_id on item (category_id);

create index ix_sale_number on sale (number);
create index ix_sale_date on sale (date);
create index ix_sale_company_id on sale (company_id);
create index ix_sale_account_id on sale (account_id);
create index ix_sale_customer_id on sale (customer_id);
create index ix_sale_currency_id on sale (currency_id);

create index ix_saleItem_sale_id on saleItem (sale_id);
create index ix_saleItem_item_id on saleItem (item_id);