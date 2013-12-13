package org.drugis.mcdaweb.standalone.workspace;

import java.util.Collection;

public interface ScenarioRepository {
	Scenario create(int workspaceId, String title, String state);
	
	Scenario update(int scenarioId, String title, String state);
	
	Collection<Scenario> findByWorkspace(int workspaceId);
	
	Scenario findById(int scenarioId);
}
