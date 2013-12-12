create table Account (id identity,
						username varchar unique,
						firstName varchar not null, 
						lastName varchar not null,
						password varchar default '',
						primary key (id));
