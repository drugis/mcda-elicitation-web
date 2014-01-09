package org.drugis.mcdaweb.standalone.repositories;

import java.util.Collection;

public interface WorkspaceRepository {
	Workspace create(int ownerId, String title, String problem);
	
	Collection<Workspace> findByOwnerId(int ownerId);
	
	Workspace findById(int workspaceId);
	
	Workspace update(Workspace workspace);
	
	boolean isWorkspaceOwnedBy(int workspaceId, int userId);
	
}
