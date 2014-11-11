-- liquibase formatted sql

-- changeset kdonald:1

create table UserConnection (userId varchar(255) not null,
  providerId varchar(255) not null,
  providerUserId varchar(255),
  rank int not null,
  displayName varchar(255),
  profileUrl varchar(512),
  imageUrl varchar(512),
  accessToken varchar(255) not null,
  secret varchar(255),
  refreshToken varchar(255),
  expireTime bigint,
  primary key (userId, providerId, providerUserId));
create unique index UserConnectionRank on UserConnection(userId, providerId, rank);

-- changeset gertvv:2

create table Account (id SERIAL NOT NULL,
            username varchar unique,
            firstName varchar not null,
            lastName varchar not null,
            password varchar default '',
            primary key (id));

create table Workspace (id SERIAL NOT NULL,
            owner int,
            title varchar not null,
            problem TEXT not null,
            defaultScenarioId int,
            primary key (id),
            FOREIGN KEY(owner) REFERENCES Account(id));

create table Scenario (id SERIAL NOT NULL,
            workspace int,
            title varchar not null,
            state TEXT not null,
            primary key (id),
            FOREIGN KEY(workspace) REFERENCES Workspace(id));

-- changeset gertvv:3

ALTER TABLE Workspace ADD CONSTRAINT Workspace_defaultScenarioId_FK FOREIGN KEY (defaultScenarioId) REFERENCES Scenario(id) DEFERRABLE;

-- changeset gertvv:4

CREATE TABLE AccountRoles (
    accountId INT,
    role VARCHAR NOT NULL,
    FOREIGN KEY (accountId) REFERENCES Account(id)
);

-- changeset reidd:5
CREATE TABLE Remarks (
  workspaceId INT NOT NULL,
  remarks VARCHAR NOT NULL,
  PRIMARY KEY (workspaceId),
  FOREIGN KEY(workspaceId) REFERENCES Workspace(id));