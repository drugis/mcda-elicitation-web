package org.drugis.mcdaweb.standalone.model;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.drugis.mcdaweb.standalone.util.ObjectToStringDeserializer;

public class Remarks {

  private Integer workspaceId;

  @JsonRawValue
  private String remarks;

  public Remarks() {
  }

  public Remarks(Integer workspaceId, String remarks) {
    this.workspaceId = workspaceId;
    this.remarks = remarks;
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

    if (remarks != null ? !remarks.equals(remarks1.remarks) : remarks1.remarks != null) return false;
    if (!workspaceId.equals(remarks1.workspaceId)) return false;

    return true;
  }

  @Override
  public int hashCode() {
    int result = workspaceId.hashCode();
    result = 31 * result + (remarks != null ? remarks.hashCode() : 0);
    return result;
  }
}

