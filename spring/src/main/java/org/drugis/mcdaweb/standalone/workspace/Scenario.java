package org.drugis.mcdaweb.standalone.workspace;

public class Scenario {
	private int id;
	private int workspace;
	private String title;
	private String state;
	
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

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public int getId() {
		return id;
	}

	public int getWorkspace() {
		return workspace;
	}
}
