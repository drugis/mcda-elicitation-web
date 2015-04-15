create table Account (id int auto_increment,
						username varchar unique,
						firstName varchar not null, 
						lastName varchar not null,
						email varchar default '', 
						password varchar default '',
						primary key (id));
