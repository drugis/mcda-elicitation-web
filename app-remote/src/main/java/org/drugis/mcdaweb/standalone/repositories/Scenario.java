package org.drugis.mcdaweb.standalone.repositories;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.drugis.mcdaweb.standalone.util.ObjectToStringDeserializer;

public class Scenario {
	private int id;
	private int workspaceId;
	private String title;

  @JsonRawValue
	private String state;
	
	public Scenario() {
		
	}

  public Scenario(int workspaceId, String title, String state) {
    this.workspaceId = workspaceId;
    this.title = title;
    this.state = state;
  }

  public Scenario(int id, int workspaceId, String title, String state) {
		this.id = id;
		this.workspaceId = workspaceId;
		this.title = title;
		this.state = state;
	}
	
	public String getTitle() {
		return title;
	}

  @JsonRawValue
	public String getState() {
		return this.state;
	}

  @JsonDeserialize(using = ObjectToStringDeserializer.class)
  public void setState(String state) {
    this.state = state;
  }

	public int getId() {
		return id;
	}

	public int getWorkspaceId() {
		return workspaceId;
	}
}
