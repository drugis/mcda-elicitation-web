package org.drugis.mcdaweb.standalone.repositories;

import org.drugis.mcdaweb.standalone.model.Remarks;

/**
 * Created by connor on 19/09/14.
 */
public interface RemarksRepository {
  Remarks find(Integer workspaceId);
}
