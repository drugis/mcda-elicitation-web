-- liquibase formatted sql
-- changeset kdonald:1

CREATE TABLE UserConnection (
  userId varchar(255) NOT NULL,
  providerId varchar(255) NOT NULL,
  providerUserId varchar(255),
  rank int NOT NULL,
  displayName varchar(255),
  profileUrl varchar(512),
  imageUrl varchar(512),
  accessToken varchar(255) NOT NULL,
  secret varchar(255),
  refreshToken varchar(255),
  expireTime bigint,
  PRIMARY KEY (userId, providerId, providerUserId)
);

CREATE UNIQUE INDEX UserConnectionRank ON UserConnection (userId, providerId, rank);

-- changeset gertvv:2
CREATE TABLE Account (
  id serial NOT NULL,
  username varchar UNIQUE,
  firstName varchar NOT NULL,
  lastName varchar NOT NULL,
  password varchar DEFAULT '',
  PRIMARY KEY (id)
);

CREATE TABLE Workspace (
  id serial NOT NULL,
  owner int,
  title varchar NOT NULL,
  problem text NOT NULL,
  defaultScenarioId int,
  PRIMARY KEY (id),
  FOREIGN KEY (OWNER) REFERENCES Account (id)
);

CREATE TABLE Scenario (
  id serial NOT NULL,
  workspace int,
  title varchar NOT NULL,
  state text NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (workspace) REFERENCES Workspace (id)
);

-- changeset gertvv:3
ALTER TABLE Workspace
  ADD CONSTRAINT Workspace_defaultScenarioId_FK FOREIGN KEY (defaultScenarioId) REFERENCES Scenario (id) DEFERRABLE;

-- changeset gertvv:4
CREATE TABLE AccountRoles (
  accountId int,
  role VARCHAR NOT NULL,
  FOREIGN KEY (accountId) REFERENCES Account (id)
);

-- changeset reidd:5
CREATE TABLE Remarks (
  workspaceId int NOT NULL,
  remarks varchar NOT NULL,
  PRIMARY KEY (workspaceId),
  FOREIGN KEY (workspaceId) REFERENCES Workspace (id)
);

-- changeset bobgoe:6
ALTER TABLE Workspace
  ALTER COLUMN problem TYPE JSON
  USING problem::json;

ALTER TABLE Scenario
  ALTER COLUMN state TYPE JSON
  USING state::json;

ALTER TABLE Remarks
  ALTER COLUMN remarks TYPE JSON
  USING remarks::json;

-- changeset joelkuiper:7
ALTER TABLE Account
  ADD COLUMN email varchar DEFAULT '';

-- changeset keijserj:8
CREATE TABLE effectsTableExclusion (
  workspaceId int NOT NULL,
  alternativeId varchar(255) NOT NULL,
  PRIMARY KEY (workspaceId, alternativeId)
);

-- changeset keijserj:9
CREATE TABLE subProblem (
  id serial NOT NULL,
  workspaceId int NOT NULL,
  definition jsonb NOT NULL,
  title varchar NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (workspaceId) REFERENCES workspace (id) ON DELETE CASCADE
);

INSERT INTO subProblem (workspaceId, definition, title)
SELECT
  id,
  '{}',
  'Default'
FROM
  workspace;

ALTER TABLE scenario
  ADD COLUMN subProblemId int;

ALTER TABLE workspace
  ADD COLUMN defaultSubProblemId int;

UPDATE
  workspace
SET
  defaultSubProblemId = subProblem.id
FROM
  subProblem
WHERE
  subProblem.workspaceId = workspace.id;

ALTER TABLE workspace
  ADD FOREIGN KEY (defaultSubProblemId) REFERENCES subProblem (id) ON DELETE CASCADE;

UPDATE
  scenario
SET
  subProblemId = subProblem.id
FROM
  subProblem
WHERE
  subProblem.workspaceId = scenario.workspace;

ALTER TABLE scenario
  ALTER COLUMN subProblemId SET NOT NULL;

ALTER TABLE scenario
  ADD FOREIGN KEY (subProblemId) REFERENCES subProblem (id) ON DELETE CASCADE;

DROP TABLE remarks;

ALTER TABLE workspace
  ALTER COLUMN OWNER SET NOT NULL;

--changeset keijserj:10
ALTER TABLE effectsTableExclusion RENAME TO effectsTableAlternativeInclusion;

--changeset keijserj:11
DROP TABLE effectsTableAlternativeInclusion;

--changeset reidd:12
CREATE TABLE inProgressWorkspace (
  id serial NOT NULL,
  owner INT NOT NULL,
  state jsonb NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (OWNER) REFERENCES Account (id)
);

--changeset reidd:13
CREATE TABLE ordering (
  workspaceId int NOT NULL,
  ordering jsonb NOT NULL,
  PRIMARY KEY (workspaceId),
  FOREIGN KEY (workspaceId) REFERENCES workspace (id) ON DELETE CASCADE
);

--changeset keijserj:14
CREATE TABLE toggledColumns (
  workspaceId int NOT NULL,
  toggledColumns jsonb NOT NULL,
  PRIMARY KEY (workspaceId),
  FOREIGN KEY (workspaceId) REFERENCES workspace (id) ON DELETE CASCADE
);

--changeset reidd:15
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (
  OIDS = FALSE
);

ALTER TABLE "session"
  ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

--changeset keijserj:16
CREATE TABLE workspaceSettings (
  workspaceId int NOT NULL,
  settings jsonb NOT NULL,
  PRIMARY KEY (workspaceId),
  FOREIGN KEY (workspaceId) REFERENCES workspace (id) ON DELETE CASCADE
);

--changeset reidd:17
DROP TABLE toggledColumns;

--changeset reidd:18
DROP TABLE UserConnection;

--changeset reidd:19
START TRANSACTION;

ALTER TABLE scenario
  DROP CONSTRAINT scenario_workspace_fkey;

ALTER TABLE scenario
  ADD CONSTRAINT scenario_workspace_fkey FOREIGN KEY (workspace) REFERENCES workspace (id) ON DELETE CASCADE;

COMMIT;

--rollback START TRANSACTION;
--rollback ALTER TABLE scenario DROP CONSTRAINT scenario_workspace_fkey;
--rollback ALTER TABLE scenario ADD CONSTRAINT scenario_workspace_fkey FOREIGN KEY (workspace) REFERENCES workspace(id);
--rollback COMMIT;
--changeset keijserj:20

START TRANSACTION;

ALTER TABLE scenario
  DROP CONSTRAINT scenario_workspace_fkey;

ALTER TABLE scenario
  ADD CONSTRAINT scenario_workspace_fkey FOREIGN KEY (workspace) REFERENCES workspace (id) ON DELETE CASCADE;

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
    settings #> '{settings}' ->> 'effectsDisplay' AS displayValue
  FROM
    workspacesettings
  WHERE
    settings #> '{settings, effectsDisplay}' IS NOT NULL
),
newSettings AS (
  SELECT
    workspaceId,
    CASE WHEN displayValue = 'deterministic' THEN
      '{"displayMode": "enteredData"}'::jsonb
    WHEN displayValue = 'sourceData' THEN
      '{"displayMode": "enteredData"}'::jsonb
    WHEN displayValue = 'smaaDistributions' THEN
      '{"displayMode": "enteredData"}'::jsonb
    WHEN displayValue = 'effects' THEN
      '{"displayMode": "values"}'::jsonb
    WHEN displayValue = 'deterministicMCDA' THEN
      '{"displayMode": "values"}'::jsonb
    WHEN displayValue = 'smaa' THEN
      '{"displayMode": "values"}'::jsonb
    END AS displayMode,
    CASE WHEN displayValue = 'deterministic' THEN
      '{"analysisType": "deterministic"}'::jsonb
    WHEN displayValue = 'sourceData' THEN
      '{"analysisType": "deterministic"}'::jsonb
    WHEN displayValue = 'smaaDistributions' THEN
      '{"analysisType": "smaa"}'::jsonb
    WHEN displayValue = 'effects' THEN
      '{"analysisType": "deterministic"}'::jsonb
    WHEN displayValue = 'deterministicMCDA' THEN
      '{"analysisType": "deterministic"}'::jsonb
    WHEN displayValue = 'smaa' THEN
      '{"analysisType": "smaa"}'::jsonb
    END AS analysisType
  FROM
    effectsDisplay)
UPDATE
  workspacesettings
SET
  settings = jsonb_set(jsonb_set(settings, '{settings, analysisType}', newSettings.analysisType -> 'analysisType'), '{settings, displayMode}', newSettings.displayMode -> 'displayMode')
FROM
  newSettings
WHERE
  workspacesettings.workspaceId = newSettings.workspaceId;

UPDATE
  workspacesettings
SET
  settings = settings #- '{settings, effectsDisplay}';

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

ALTER TABLE workspace
  DROP CONSTRAINT workspace_defaultsubproblemid_fkey;

ALTER TABLE workspace
  ADD CONSTRAINT workspace_defaultsubproblemid_fkey FOREIGN KEY (defaultSubproblemId) REFERENCES subproblem (id);

--rollback ALTER TABLE workspace DROP CONSTRAINT workspace_defaultsubproblemid_fkey;
--rollback ALTER TABLE workspace ADD CONSTRAINT workspace_defaultsubproblemid_fkey FOREIGN KEY (defaultSubproblemId) REFERENCES subproblem(id) ON DELETE CASCADE;

--changeset zalitek:23
DROP TABLE accountroles;

ALTER TABLE inprogressworkspace
  DROP CONSTRAINT inprogressworkspace_owner_fkey;

ALTER TABLE inprogressworkspace
  ADD CONSTRAINT inprogressworkspace_owner_fkey FOREIGN KEY (OWNER) REFERENCES account (id) ON DELETE CASCADE;

ALTER TABLE workspace
  DROP CONSTRAINT workspace_owner_fkey;

ALTER TABLE workspace
  ADD CONSTRAINT workspace_owner_fkey FOREIGN KEY (OWNER) REFERENCES account (id) ON DELETE CASCADE;

--rollback CREATE TABLE AccountRoles (
--rollback     accountId INT,
--rollback     role VARCHAR NOT NULL,
--rollback     FOREIGN KEY (accountId) REFERENCES Account(id)
--rollback );
--rollback ALTER TABLE inprogressworkspace DROP CONSTRAINT inprogressworkspace_owner_fkey;
--rollback ALTER TABLE inprogressworkspace ADD CONSTRAINT inprogressworkspace_owner_fkey FOREIGN KEY (owner) REFERENCES account(id);
--rollback ALTER TABLE workspace DROP CONSTRAINT workspace_owner_fkey;
--rollback ALTER TABLE workspace ADD CONSTRAINT workspace_owner_fkey FOREIGN KEY (owner) REFERENCES account(id);

--changeset reidd:24
ALTER TABLE inProgressWorkspace
  ADD COLUMN title varchar NOT NULL DEFAULT '';

ALTER TABLE inProgressWorkspace
  ADD COLUMN therapeuticContext varchar DEFAULT '';

ALTER TABLE inProgressWorkspace
  ADD COLUMN useFavourability boolean;

CREATE TABLE inProgressCriterion (
  id varchar NOT NULL,
  inProgressWorkspaceId int NOT NULL,
  orderIndex int NOT NULL,
  title varchar NOT NULL DEFAULT '',
  description varchar NOT NULL DEFAULT '',
  isFavourable boolean,
  PRIMARY KEY (id),
  FOREIGN KEY (inProgressWorkspaceId) REFERENCES inprogressworkspace (id) ON DELETE CASCADE
);

CREATE TYPE unitType AS enum (
  'custom',
  'percentage',
  'decimal'
);

CREATE TABLE inProgressDataSource (
  id varchar NOT NULL,
  inProgressWorkspaceId int NOT NULL,
  orderIndex int NOT NULL,
  criterionId varchar NOT NULL,
  reference varchar NOT NULL DEFAULT '',
  unitLabel varchar NOT NULL DEFAULT '',
  unitType unitType NOT NULL DEFAULT 'custom',
  unitLowerBound int,
  unitUpperBound int,
  uncertainty varchar NOT NULL DEFAULT '',
  strengthOfEvidence varchar NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  FOREIGN KEY (criterionId) REFERENCES inProgressCriterion (id) ON DELETE CASCADE,
  FOREIGN KEY (inProgressWorkspaceId) REFERENCES inprogressworkspace (id) ON DELETE CASCADE
);

CREATE TABLE inProgressAlternative (
  id varchar NOT NULL,
  orderIndex int NOT NULL,
  inProgressWorkspaceId int NOT NULL,
  title varchar NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  FOREIGN KEY (inProgressWorkspaceId) REFERENCES inprogressworkspace (id) ON DELETE CASCADE
);

CREATE TYPE effectOrDistributionType AS enum (
  'effect',
  'distribution'
);

CREATE TYPE inputTypeType AS enum (
  'value',
  'valueCI',
  'range',
  'empty',
  'text',
  'normal',
  'beta',
  'gamma'
);

CREATE TABLE inProgressWorkspaceCell (
  inProgressWorkspaceId int NOT NULL,
  alternativeId varchar NOT NULL,
  dataSourceId varchar NOT NULL,
  criterionId varchar NOT NULL,
  val float,
  lowerbound float,
  upperbound float,
  isNotEstimableLowerBound boolean,
  isNotEstimableUpperBound boolean,
  txt varchar,
  mean float,
  standardError float,
  alpha float,
  beta float,
  cellType effectOrDistributionType NOT NULL,
  inputType inputTypeType NOT NULL,
  PRIMARY KEY (alternativeId, dataSourceId, criterionId, cellType),
  FOREIGN KEY (alternativeId) REFERENCES inProgressAlternative (id) ON DELETE CASCADE,
  FOREIGN KEY (dataSourceId) REFERENCES inProgressDataSource (id) ON DELETE CASCADE,
  FOREIGN KEY (criterionId) REFERENCES inProgressCriterion (id) ON DELETE CASCADE,
  FOREIGN KEY (inProgressWorkspaceId) REFERENCES inprogressworkspace (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX inProgressWorkspaceCell_index ON inProgressWorkspaceCell (alternativeId, dataSourceId, criterionId, cellType);

--rollback ALTER TABLE inProgressWorkspace DROP COLUMN title;
--rollback ALTER TABLE inProgressWorkspace DROP COLUMN therapeuticContext;
--rollback ALTER TABLE inProgressWorkspace DROP COLUMN useFavourability;
--rollback DROP TABLE inProgressWorkspaceCell;
--rollback DROP TABLE inProgressDataSource;
--rollback DROP TABLE inProgressAlternative;
--rollback DROP TABLE inProgressCriterion;
--rollback DROP TYPE unitType;
--rollback DROP TYPE effectOrDistributionType;
--rollback DROP TYPE inputTypeType;
--rollback DROP INDEX inProgressWorkspaceCell_index;

--changeset zalitek:25
ALTER TABLE inProgressDataSource 
  ADD COLUMN referenceLink varchar;
--rollback ALTER TABLE inProgressDataSource DROP COLUMN referenceLink;