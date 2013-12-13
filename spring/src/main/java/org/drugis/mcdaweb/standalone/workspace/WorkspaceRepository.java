package org.drugis.mcdaweb.standalone.workspace;

import java.util.Collection;

public interface WorkspaceRepository {
	Workspace create(int ownerId, String title, String problem);
	
	Collection<Workspace> findByOwnerId(int ownerId);
	
	Workspace findById(int workspaceId);
}
