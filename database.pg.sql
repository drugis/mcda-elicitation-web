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
	
-- changeset bobgoe:6

ALTER TABLE Workspace ALTER COLUMN problem TYPE JSON USING problem::JSON;
ALTER TABLE Scenario ALTER COLUMN state TYPE JSON USING state::JSON;
ALTER TABLE Remarks ALTER COLUMN remarks TYPE JSON USING remarks::JSON;
  
-- changeset joelkuiper:7
ALTER TABLE Account ADD COLUMN email VARCHAR DEFAULT '';

-- changeset keijserj:8
CREATE TABLE effectsTableExclusion (
  workspaceId INT NOT NULL,
  alternativeId VARCHAR(255) NOT NULL,
  PRIMARY KEY (workspaceId, alternativeId)
);

-- changeset keijserj:9
CREATE TABLE subProblem(
  id SERIAL NOT NULL,
  workspaceId INT NOT NULL,
  definition JSONB NOT NULL,
  title VARCHAR NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(workspaceId) REFERENCES workspace(id) ON DELETE CASCADE
);
INSERT INTO subProblem (workspaceId, definition, title) SELECT id, '{}', 'Default' FROM workspace;
ALTER TABLE scenario ADD COLUMN subProblemId INT;
ALTER TABLE workspace ADD COLUMN defaultSubProblemId INT;
UPDATE workspace SET defaultSubProblemId = subProblem.id FROM subProblem WHERE subProblem.workspaceId = workspace.id;
ALTER TABLE workspace ADD FOREIGN KEY (defaultSubProblemId) REFERENCES subProblem (id) ON DELETE CASCADE;
UPDATE scenario SET subProblemId = subProblem.id FROM subProblem WHERE subProblem.workspaceId = scenario.workspace;
ALTER TABLE scenario ALTER COLUMN subProblemId SET NOT NULL;
ALTER TABLE scenario ADD FOREIGN KEY (subProblemId) REFERENCES subProblem (id) ON DELETE CASCADE;
DROP TABLE remarks;
ALTER TABLE workspace ALTER COLUMN owner SET NOT NULL;

--changeset keijserj:10
ALTER TABLE effectsTableExclusion RENAME TO effectsTableAlternativeInclusion;

--changeset keijserj:11
DROP TABLE effectsTableAlternativeInclusion;

--changeset reidd:12
CREATE TABLE inProgressWorkspace(
  id SERIAL NOT NULL,
  owner INT NOT NULL,
  state  JSONB NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(owner) REFERENCES Account(id)
);

--changeset reidd:13
CREATE TABLE ordering(
  workspaceId INT NOT NULL,
  ordering JSONB NOT NULL,
  PRIMARY KEY (workspaceId),
  FOREIGN KEY(workspaceId) REFERENCES workspace(id) ON DELETE CASCADE
);
