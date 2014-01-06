package org.drugis.mcdaweb.standalone.controllers;

import java.security.Principal;
import java.util.Collection;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.drugis.mcdaweb.standalone.account.Account;
import org.drugis.mcdaweb.standalone.account.AccountRepository;
import org.drugis.mcdaweb.standalone.repositories.Scenario;
import org.drugis.mcdaweb.standalone.repositories.ScenarioRepository;
import org.drugis.mcdaweb.standalone.repositories.Workspace;
import org.drugis.mcdaweb.standalone.repositories.WorkspaceRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WorkspacesController {
	@Inject	private AccountRepository accountRepository;
	@Inject	private WorkspaceRepository workspaceRepository;
	@Inject	private ScenarioRepository scenarioRepository;

	/*
	 * Workspaces
	 */
	
	@RequestMapping(value="/workspaces", method=RequestMethod.GET)
	@ResponseBody
	public Collection<Workspace> query(Principal currentUser) {
		Account user = accountRepository.findAccountByUsername(currentUser.getName());
		return workspaceRepository.findByOwnerId(user.getId());
	}
	
	@RequestMapping(value="/workspaces", method=RequestMethod.POST)
	@ResponseBody
	public Workspace create(HttpServletRequest request, HttpServletResponse response, Principal currentUser, @RequestBody Workspace body) {
		Account user = accountRepository.findAccountByUsername(currentUser.getName());
		Workspace workspace = workspaceRepository.create(user.getId(), body.getTitle(), body.getProblem());
		response.setStatus(HttpServletResponse.SC_CREATED);
		response.setHeader("Location", request.getRequestURL() + "/" + workspace.getId());
		return workspace;
	}
	
	@RequestMapping(value="/workspaces/{workspaceId}", method=RequestMethod.GET)
	@ResponseBody
	public Workspace get(HttpServletResponse response, Principal currentUser, @PathVariable int workspaceId) {
		Account user = accountRepository.findAccountByUsername(currentUser.getName());
		Workspace workspace = workspaceRepository.findById(workspaceId, user.getId());
		if (workspace == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		return workspace;
	}
	
	@RequestMapping(value="/workspaces/{workspaceId}", method=RequestMethod.POST)
	@ResponseBody
	public Workspace update(HttpServletRequest request, HttpServletResponse response, Principal currentUser, @PathVariable int workspaceId, @RequestBody Workspace body) {
		Account user = accountRepository.findAccountByUsername(currentUser.getName());
		Workspace workspace = workspaceRepository.update(body, user.getId());
		if (workspace == null) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
		return workspace;
	}
	
	/*
	 * Scenarios
	 */
	
	@RequestMapping(value="/workspaces/{workspaceId}/scenarios", method=RequestMethod.GET)
	@ResponseBody
	public Collection<Scenario> queryScenarios(Principal currentUser, @PathVariable int workspaceId) {
		Collection<Scenario> scenarios = scenarioRepository.findByWorkspace(workspaceId);
		for (Scenario scenario : scenarios) {
			scenario.setState(null);
		}
		return scenarios;
	}
	
	@RequestMapping(value="/workspaces/{workspaceId}/scenarios", method=RequestMethod.POST)
	@ResponseBody
	public Scenario createScenario(HttpServletRequest request, HttpServletResponse response, Principal currentUser, @PathVariable int workspaceId, @RequestBody Scenario body) {
		Scenario scenario = scenarioRepository.create(workspaceId, body.getTitle(), body.getState()); // FIXME: check user
		response.setStatus(HttpServletResponse.SC_CREATED);
		response.setHeader("Location", request.getRequestURL() + "/" + scenario.getId());
		return scenario;
	}
	
	@RequestMapping(value="/workspaces/{workspaceId}/scenarios/{scenarioId}", method=RequestMethod.GET)
	@ResponseBody
	public Scenario getScenario(Principal currentUser, @PathVariable int workspaceId, @PathVariable int scenarioId) {
		return scenarioRepository.findById(scenarioId); // FIXME: check user
	}
	
	@RequestMapping(value="/workspaces/{workspaceId}/scenarios/{scenarioId}", method=RequestMethod.POST)
	@ResponseBody
	public Scenario updateScenario(Principal currentUser, @PathVariable int workspaceId, @PathVariable int scenarioId, @RequestBody Scenario body) {
		Scenario scenario = scenarioRepository.update(scenarioId, body.getTitle(), body.getState()); // FIXME: check user
		return scenario;
	}
}