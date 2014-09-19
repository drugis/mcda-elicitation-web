package org.drugis.mcdaweb.standalone.model;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.drugis.mcdaweb.standalone.util.ObjectToStringDeserializer;

public class Remarks {

  private Integer id;

  private Integer workspaceId;

  @JsonRawValue
  private String remarks;

  public Remarks() {
  }

  public Remarks(Integer workspaceId, String remarks) {
    this.workspaceId = workspaceId;
    this.remarks = remarks;
  }

  public Remarks(Integer id, Integer workspaceId, String remarks) {
    this.id = id;
    this.workspaceId = workspaceId;
    this.remarks = remarks;
  }

  public Integer getId() {
    return id;
  }

  public Integer getWorkspaceId() {
    return workspaceId;
  }

  public String getRemarks() {
    return remarks;
  }

  @JsonDeserialize(using = ObjectToStringDeserializer.class)
  public void setRemarks(String remarks) {
    this.remarks = remarks;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Remarks remarks1 = (Remarks) o;

    if (id != null ? !id.equals(remarks1.id) : remarks1.id != null) return false;
    if (remarks != null ? !remarks.equals(remarks1.remarks) : remarks1.remarks != null) return false;
    if (workspaceId != null ? !workspaceId.equals(remarks1.workspaceId) : remarks1.workspaceId != null) return false;

    return true;
  }

  @Override
  public int hashCode() {
    int result = id != null ? id.hashCode() : 0;
    result = 31 * result + (workspaceId != null ? workspaceId.hashCode() : 0);
    result = 31 * result + (remarks != null ? remarks.hashCode() : 0);
    return result;
  }
}

