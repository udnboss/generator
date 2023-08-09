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

create table [category] (
  id text
  , name text not null
  , category_id text
  , items text
  , primary key (id)
  , unique (name)
  , foreign key (category_id) references category(id) ON DELETE CASCADE ON DELETE CASCADE
);

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

create table [currency] (
  id text not null
  , name text not null
  , symbol text not null
  , primary key (id)
  , unique (name)
);

create table [customer] (
  id text
  , name text not null
  , address text
  , contact text
  , currency_id text
  , payment_term int
  , sales text
  , primary key (id)
  , unique (name)
  , foreign key (currency_id) references currency(id) ON DELETE CASCADE ON DELETE CASCADE
);

create table [item] (
  id text
  , name text not null
  , category_id text
  , primary key (id)
  , unique (name)
  , foreign key (category_id) references category(id) ON DELETE CASCADE ON DELETE CASCADE
);

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
  , items text
  , primary key (id)
  , unique (number)
  , foreign key (company_id) references company(id) ON DELETE CASCADE ON DELETE CASCADE
  , foreign key (account_id) references account(id) ON DELETE CASCADE ON DELETE CASCADE
  , foreign key (customer_id) references customer(id) ON DELETE CASCADE ON DELETE CASCADE
  , foreign key (currency_id) references currency(id) ON DELETE CASCADE ON DELETE CASCADE
);

create table [saleItem] (
  id text
  , sale_id text not null
  , item_id text not null
  , description text not null
  , quantity int not null
  , price real not null
  , primary key (id)
  , unique (sale_id, item_id)
  , foreign key (sale_id) references sale(id) ON DELETE CASCADE ON DELETE CASCADE
  , foreign key (item_id) references item(id) ON DELETE CASCADE ON DELETE CASCADE
);

create index ix_account_label asc on account (label asc);
create index ix_account_label on account (label);

create index ix_category_name asc on category (name asc);
create index ix_category_name on category (name);
create index ix_category_category_id on category (category_id);

create index ix_company_name asc on company (name asc);
create index ix_company_name on company (name);

create index ix_currency_name asc on currency (name asc);
create index ix_currency_name on currency (name);

create index ix_customer_name asc on customer (name asc);
create index ix_customer_name on customer (name);
create index ix_customer_currency_id on customer (currency_id);

create index ix_item_name asc on item (name asc);
create index ix_item_name on item (name);
create index ix_item_category_id on item (category_id);

create index ix_sale_number desc on sale (number desc);
create index ix_sale_number on sale (number);
create index ix_sale_date on sale (date);
create index ix_sale_company_id on sale (company_id);
create index ix_sale_account_id on sale (account_id);
create index ix_sale_customer_id on sale (customer_id);
create index ix_sale_currency_id on sale (currency_id);

create index ix_saleItem_item.name on saleItem (item.name);
create index ix_saleItem_sale_id on saleItem (sale_id);
create index ix_saleItem_item_id on saleItem (item_id);