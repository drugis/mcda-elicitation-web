package org.drugis.mcdaweb.standalone.controllers;

import org.drugis.mcdaweb.standalone.account.Account;
import org.drugis.mcdaweb.standalone.account.AccountRepository;
import org.drugis.mcdaweb.standalone.model.Remarks;
import org.drugis.mcdaweb.standalone.repositories.*;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.Collection;

@Controller
@RequestMapping(value="/workspaces")
public class WorkspacesController {

  final static Logger logger = LoggerFactory.getLogger(WorkspacesController.class);
  public static final String DEFAULT_SCENARIO_TITLE = "Default";


  public class ResourceNotOwnedException extends Exception {
    private static final long serialVersionUID = -3342170675559096956L;

  }

  public class ResourceDoesNotExistException extends Exception {
    private static final long serialVersionUID = 9073600696022098494L;

  }

  @Inject	private AccountRepository accountRepository;
  @Inject	private WorkspaceRepository workspaceRepository;
  @Inject	private ScenarioRepository scenarioRepository;
  @Inject private RemarksRepository remarksRepository;

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
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("problem", workspace.getProblem());
    Scenario defaultScenario = scenarioRepository.create(workspace.getId(), DEFAULT_SCENARIO_TITLE, jsonObject.toString());
    workspace.setDefaultScenarioId(defaultScenario.getId());
    workspaceRepository.update(workspace);
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
    if (scenario.getWorkspaceId() != workspace.getId()) {
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

  @RequestMapping(value="/{workspaceId}/remarks", method=RequestMethod.GET)
  @ResponseBody
  public Remarks findRemarks(@PathVariable int workspaceId) throws Exception {
    return remarksRepository.find(workspaceId);
  }

  @RequestMapping(value="/{workspaceId}/remarks", method=RequestMethod.POST)
  @ResponseBody
  public Remarks updateRemarks(HttpServletResponse response,  Principal currentUser, @PathVariable Integer workspaceId, @RequestBody Remarks remarks) throws Exception {
    // actual workspace not needed, just check whether it exists and user owns it
    get(response, currentUser, workspaceId);

    if(remarks.getId() == null) {
      Remarks createdRemarks =  remarksRepository.create(workspaceId, remarks.getRemarks());
      response.setStatus(HttpServletResponse.SC_CREATED);
      return createdRemarks;
    }
    return remarksRepository.update(workspaceId, remarks.getRemarks());
  }

  public static class ErrorResponse {
    public int code;
    public String message;

    public ErrorResponse(int code, String message) {
      this.code = code;
      this.message = message;
    }
  }

  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler(ResourceDoesNotExistException.class)
  @ResponseBody
  public ErrorResponse handleResourceDoesNotExist(HttpServletRequest request) {
    logger.error("Resource not found.\n{}", request.getRequestURL());
    return new ErrorResponse(404, "Resource not found");
  }

  @ResponseStatus(HttpStatus.FORBIDDEN)
  @ExceptionHandler(ResourceNotOwnedException.class)
  @ResponseBody
  public ErrorResponse handleResourceNotOwned(HttpServletRequest request) {
    logger.error("Access to resource not authorised.\n{}", request.getRequestURL());
    return new ErrorResponse(403, "Access to resource not authorised");
  }

}
