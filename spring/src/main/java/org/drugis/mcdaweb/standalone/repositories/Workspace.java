package org.drugis.mcdaweb.standalone.repositories;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.JsonNode;

public class Workspace {
	private int id;
	private int owner;
	private Integer defaultScenarioId;
	private String title;
	private Object problem;
	
	public Workspace() {

	}
	
	public Workspace(int id, int owner, Integer defaultScenarioId, String title, String problem) {
		this.id = id;
		this.owner = owner;
		this.defaultScenarioId = defaultScenarioId;
		this.title = title;
		this.problem = problem;
	}
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@JsonRawValue
	public String getProblem() {
		return problem == null ? "{}" : problem.toString();
	}

	public void setProblem(JsonNode node) {
		this.problem = node.toString();
	}

	public int getId() {
		return id;
	}

	public int getOwner() {
		return owner;
	}

	public Integer getDefaultScenarioId() {
		return defaultScenarioId;
	}

	public void setDefaultScenarioId(Integer defaultScenarioId) {
		this.defaultScenarioId = defaultScenarioId;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime
				* result
				+ ((defaultScenarioId == null) ? 0 : defaultScenarioId
						.hashCode());
		result = prime * result + id;
		result = prime * result + owner;
		result = prime * result + ((problem == null) ? 0 : problem.hashCode());
		result = prime * result + ((title == null) ? 0 : title.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Workspace other = (Workspace) obj;
		if (defaultScenarioId == null) {
			if (other.defaultScenarioId != null)
				return false;
		} else if (!defaultScenarioId.equals(other.defaultScenarioId))
			return false;
		if (id != other.id)
			return false;
		if (owner != other.owner)
			return false;
		if (problem == null) {
			if (other.problem != null)
				return false;
		} else if (!problem.equals(other.problem))
			return false;
		if (title == null) {
			if (other.title != null)
				return false;
		} else if (!title.equals(other.title))
			return false;
		return true;
	}
	
	
}
