create table Scenario (id int auto_increment,
						workspace int,
						title varchar not null,
						state CLOB not null,
						primary key (id),
						FOREIGN KEY(workspace) REFERENCES Workspace(id));
