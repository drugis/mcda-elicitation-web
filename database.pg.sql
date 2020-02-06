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

--changeset keijserj:14
CREATE TABLE toggledColumns(
  workspaceId INT NOT NULL,
  toggledColumns JSONB NOT NULL,
  PRIMARY KEY (workspaceId),
  FOREIGN KEY(workspaceId) REFERENCES workspace(id) ON DELETE CASCADE
);

--changeset reidd:15
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

--changeset keijserj:16
CREATE TABLE workspaceSettings(
  workspaceId INT NOT NULL,
  settings JSONB NOT NULL,
  PRIMARY KEY (workspaceId),
  FOREIGN KEY (workspaceId) REFERENCES workspace(id) ON DELETE CASCADE
);

--changeset reidd:17
DROP TABLE toggledColumns;

--changeset reidd:18
DROP TABLE UserConnection;

--changeset reidd:19
START TRANSACTION;
ALTER TABLE scenario DROP CONSTRAINT scenario_workspace_fkey;
ALTER TABLE scenario ADD CONSTRAINT scenario_workspace_fkey FOREIGN KEY (workspace) REFERENCES workspace(id) ON DELETE CASCADE;
COMMIT;
--rollback START TRANSACTION;
--rollback ALTER TABLE scenario DROP CONSTRAINT scenario_workspace_fkey;
--rollback ALTER TABLE scenario ADD CONSTRAINT scenario_workspace_fkey FOREIGN KEY (workspace) REFERENCES workspace(id);
--rollback COMMIT;

--changeset keijserj:20
START TRANSACTION;
ALTER TABLE scenario DROP CONSTRAINT scenario_workspace_fkey;
ALTER TABLE scenario ADD CONSTRAINT scenario_workspace_fkey FOREIGN KEY (workspace) REFERENCES workspace(id) ON DELETE CASCADE;
COMMIT;
--rollback START TRANSACTION;
--rollback ALTER TABLE scenario DROP CONSTRAINT scenario_workspace_fkey;
--rollback ALTER TABLE scenario ADD CONSTRAINT scenario_workspace_fkey FOREIGN KEY (workspace) REFERENCES workspace(id);
--rollback COMMIT;

--changeset keijserj:21
START TRANSACTION;
WITH effectsDisplay AS (
  SELECT 
    workspaceId, 
    settings#>'{settings}'->>'effectsDisplay' AS displayValue 
  FROM workspacesettings 
  WHERE settings#>'{settings, effectsDisplay}' IS NOT NULL
),
newSettings AS (
  SELECT 
    workspaceId, 
    CASE
      WHEN displayValue = 'deterministic' THEN '{"displayMode": "enteredData"}'::jsonb
      WHEN displayValue = 'sourceData' THEN '{"displayMode": "enteredData"}'::jsonb
      WHEN displayValue = 'smaaDistributions' THEN '{"displayMode": "enteredData"}'::jsonb
      WHEN displayValue = 'effects' THEN '{"displayMode": "values"}'::jsonb
      WHEN displayValue = 'deterministicMCDA' THEN '{"displayMode": "values"}'::jsonb
      WHEN displayValue = 'smaa' THEN '{"displayMode": "values"}'::jsonb
    END AS displayMode,
    CASE
      WHEN displayValue = 'deterministic' THEN '{"analysisType": "deterministic"}'::jsonb
      WHEN displayValue = 'sourceData' THEN '{"analysisType": "deterministic"}'::jsonb
      WHEN displayValue = 'smaaDistributions' THEN '{"analysisType": "smaa"}'::jsonb
      WHEN displayValue = 'effects' THEN '{"analysisType": "deterministic"}'::jsonb
      WHEN displayValue = 'deterministicMCDA' THEN '{"analysisType": "deterministic"}'::jsonb
      WHEN displayValue = 'smaa' THEN '{"analysisType": "smaa"}'::jsonb
    END AS analysisType
  FROM effectsDisplay
)

UPDATE workspacesettings 
SET settings = 
jsonb_set(
  jsonb_set(settings, '{settings, analysisType}', newSettings.analysisType->'analysisType'), 
  '{settings, displayMode}', 
  newSettings.displayMode->'displayMode'
)
FROM newSettings 
WHERE workspacesettings.workspaceId = newSettings.workspaceId;

UPDATE workspacesettings 
SET settings = settings #-'{settings, effectsDisplay}';
COMMIT;

--rollback START TRANSACTION;
--rollback WITH oldSettings AS (
--rollback   SELECT 
--rollback     workspaceId, 
--rollback     settings#>'{settings}'->>'analysisType' AS analysisType,
--rollback     settings#>'{settings}'->>'displayMode' AS displayMode 
--rollback   FROM workspacesettings 
--rollback   WHERE settings#>'{settings, analysisType}' IS NOT NULL
--rollback   AND settings#>'{settings, displayMode}' IS NOT NULL
--rollback ),
--rollback 
--rollback newSettings AS (
--rollback   SELECT 
--rollback     workspaceId, 
--rollback     CASE
--rollback       WHEN analysisType = 'deterministic' AND displayMode = 'enteredData' THEN '{"effectsDisplay": "deterministic"}'::jsonb
--rollback       WHEN analysisType = 'smaa' AND displayMode = 'enteredData' THEN '{"effectsDisplay": "smaaDistributions"}'::jsonb
--rollback       WHEN analysisType = 'deterministic' AND displayMode = 'values' THEN '{"effectsDisplay": "deterministicMCDA"}'::jsonb
--rollback       WHEN analysisType = 'smaa' AND displayMode = 'values' THEN '{"effectsDisplay": "smaa"}'::jsonb
--rollback     END AS effectsDisplay
--rollback   FROM oldSettings
--rollback )
--rollback 
--rollback UPDATE workspacesettings 
--rollback SET settings = jsonb_set(settings, '{settings, effectsDisplay}', newSettings.effectsDisplay->'effectsDisplay') 
--rollback FROM newSettings 
--rollback WHERE workspacesettings.workspaceId = newSettings.workspaceId;
--rollback 
--rollback UPDATE workspacesettings 
--rollback SET settings = settings #-'{settings, analysisType}';
--rollback 
--rollback UPDATE workspacesettings 
--rollback SET settings = settings #-'{settings, displayMode}';
--rollback COMMIT;

--changeset keijserj:22
ALTER TABLE workspace DROP CONSTRAINT workspace_defaultsubproblemid_fkey;
ALTER TABLE workspace ADD CONSTRAINT workspace_defaultsubproblemid_fkey FOREIGN KEY (defaultSubproblemId) REFERENCES subproblem(id);
--rollback ALTER TABLE workspace DROP CONSTRAINT workspace_defaultsubproblemid_fkey;
--rollback ALTER TABLE workspace ADD CONSTRAINT workspace_defaultsubproblemid_fkey FOREIGN KEY (defaultSubproblemId) REFERENCES subproblem(id) ON DELETE CASCADE;
