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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

@Controller
@RequestMapping(value="/workspaces")
public class WorkspacesController {
	
	final static Logger logger = LoggerFactory.getLogger(WorkspacesController.class);

	public class ResourceNotOwnedException extends Exception {
		private static final long serialVersionUID = -3342170675559096956L;

	}

	public class ResourceDoesNotExistException extends Exception {
		private static final long serialVersionUID = 9073600696022098494L;

	}

	@Inject	private AccountRepository accountRepository;
	@Inject	private WorkspaceRepository workspaceRepository;
	@Inject	private ScenarioRepository scenarioRepository;

	/*
	 * Workspaces
	 */
	
	@RequestMapping(value="", method=RequestMethod.GET)
	@ResponseBody
	public Collection<Workspace> query(Principal currentUser) {
		Account user = accountRepository.findAccountByUsername(currentUser.getName());
		return workspaceRepository.findByOwnerId(user.getId());
	}
	
	@RequestMapping(value="", method=RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE})
	@ResponseBody
	public Workspace create(HttpServletRequest request, HttpServletResponse response, Principal currentUser, @RequestBody Workspace body) {
		Account user = accountRepository.findAccountByUsername(currentUser.getName());
		Workspace workspace = workspaceRepository.create(user.getId(), body.getTitle(), body.getProblem());
		response.setStatus(HttpServletResponse.SC_CREATED);
		response.setHeader("Location", request.getRequestURL() + "/" + workspace.getId());
		return workspace;
	}
	
	@RequestMapping(value="/{workspaceId}", method=RequestMethod.GET)
	@ResponseBody
	public Workspace get(HttpServletResponse response, Principal currentUser, @PathVariable int workspaceId) throws ResourceDoesNotExistException, ResourceNotOwnedException {
		Workspace workspace = workspaceRepository.findById(workspaceId);
		if (workspace == null) {
			throw new ResourceDoesNotExistException();
		}
		Account user = accountRepository.findAccountByUsername(currentUser.getName());
		if(!workspaceRepository.isWorkspaceOwnedBy(workspaceId, user.getId())) {
			throw new ResourceNotOwnedException();
		}
		return workspace;
	}
	
	@RequestMapping(value="/{workspaceId}", method=RequestMethod.POST)
	@ResponseBody
	public Workspace update(HttpServletRequest request, HttpServletResponse response, Principal currentUser, @PathVariable int workspaceId, @RequestBody Workspace body) throws ResourceDoesNotExistException, ResourceNotOwnedException {
		// actual workspace not needed, just check whether it exists and user owns it
		get(response, currentUser, workspaceId);

		return workspaceRepository.update(body);
	}
	
	/*
	 * Scenarios
	 */
	
	@RequestMapping(value="/{workspaceId}/scenarios", method=RequestMethod.GET)
	@ResponseBody
	public Collection<Scenario> queryScenarios(HttpServletResponse response, Principal currentUser, @PathVariable int workspaceId) throws ResourceDoesNotExistException, ResourceNotOwnedException {
		// actual workspace not needed, just check whether it exists and user owns it
		get(response, currentUser, workspaceId);

		Collection<Scenario> scenarios = scenarioRepository.findByWorkspace(workspaceId);
		if (scenarios == null) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			return null;
		}
		for (Scenario scenario : scenarios) {
			// we don't need the State when showing a list of scenarios 
			scenario.setState(null);
		}
		return scenarios;
	}
	
	@RequestMapping(value="/{workspaceId}/scenarios", method=RequestMethod.POST)
	@ResponseBody
	public Scenario createScenario(HttpServletRequest request, HttpServletResponse response, Principal currentUser, @PathVariable int workspaceId, @RequestBody Scenario body) throws ResourceDoesNotExistException, ResourceNotOwnedException {
		// actual workspace not needed, just check whether it exists and user owns it
		get(response, currentUser, workspaceId);
		
		Scenario scenario = scenarioRepository.create(workspaceId, body.getTitle(), body.getState());
		response.setStatus(HttpServletResponse.SC_CREATED);
		response.setHeader("Location", request.getRequestURL() + "/" + scenario.getId());
		return scenario;
	}
	
	@RequestMapping(value="/{workspaceId}/scenarios/{scenarioId}", method=RequestMethod.GET)
	@ResponseBody
	public Scenario getScenario(HttpServletResponse response, Principal currentUser, @PathVariable int workspaceId, @PathVariable int scenarioId) throws ResourceDoesNotExistException, ResourceNotOwnedException {
		Workspace workspace = get(response, currentUser, workspaceId);
		Scenario scenario = scenarioRepository.findById(scenarioId);
		if (scenario == null) {
			throw new ResourceDoesNotExistException();
		}
		if (scenario.getWorkspace() != workspace.getId()) {
			throw new ResourceNotOwnedException();
		}
		return scenario;
	}
	
	@RequestMapping(value="/{workspaceId}/scenarios/{scenarioId}", method=RequestMethod.POST)
	@ResponseBody
	public Scenario updateScenario(HttpServletResponse response, Principal currentUser, @PathVariable int workspaceId, @PathVariable int scenarioId, @RequestBody Scenario body) throws ResourceDoesNotExistException, ResourceNotOwnedException {
		// actual scenario not needed; get used for security/existence checks
		getScenario(response, currentUser, workspaceId, scenarioId);
		return scenarioRepository.update(scenarioId, body.getTitle(), body.getState());
	}
	
	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(ResourceDoesNotExistException.class)
	public String handleResourceDoesNotExist(HttpServletRequest request) {
		logger.error("Resource not found.\n{}", request.getRequestURL());
		return "redirect:/error/404";
	}

	@ResponseStatus(HttpStatus.FORBIDDEN)
	@ExceptionHandler(ResourceNotOwnedException.class)
	public String handleResourceNotOwned(HttpServletRequest request) {
		logger.error("Access to resource not authorised.\n{}", request.getRequestURL());
		return "redirect:/error/404";
	}
	
}
