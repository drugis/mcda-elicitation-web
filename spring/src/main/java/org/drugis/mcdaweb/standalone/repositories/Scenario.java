package org.drugis.mcdaweb.standalone.repositories;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.JsonNode;

public class Scenario {
	private int id;
	private int workspace;
	private String title;
	private Object state;
	
	public Scenario() {
		
	}
	
	public Scenario(int id, int workspace, String title, String state) {
		this.id = id;
		this.workspace = workspace;
		this.title = title;
		this.state = state;
	}
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@JsonRawValue
	public String getState() {
		return state == null ? "{}" : state.toString();
	}

	public void setState(JsonNode node) {
		this.state = node;
	}

	public int getId() {
		return id;
	}

	public int getWorkspace() {
		return workspace;
	}
}
