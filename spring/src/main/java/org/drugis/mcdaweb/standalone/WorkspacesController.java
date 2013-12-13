package org.drugis.mcdaweb.standalone;

import java.security.Principal;
import java.util.Collection;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.drugis.mcdaweb.standalone.account.Account;
import org.drugis.mcdaweb.standalone.account.AccountRepository;
import org.drugis.mcdaweb.standalone.workspace.Workspace;
import org.drugis.mcdaweb.standalone.workspace.WorkspaceRepository;
import org.springframework.http.MediaType;
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
	
	@RequestMapping(value="/workspaces", method=RequestMethod.GET)
	@ResponseBody
	public Collection<Workspace> query(Principal currentUser) {
		Account user = accountRepository.findAccountByUsername(currentUser.getName());
		return workspaceRepository.findByOwnerId(user.getId());
	}
	
	@RequestMapping(value="/workspaces", method=RequestMethod.POST)
	public void create(HttpServletRequest request, HttpServletResponse response, Principal currentUser, @RequestBody Workspace body) {
		Account user = accountRepository.findAccountByUsername(currentUser.getName());
		Workspace workspace = workspaceRepository.create(user.getId(), body.getTitle(), body.getProblem());
		response.setStatus(HttpServletResponse.SC_CREATED);
		response.setHeader("Location", request.getRequestURI() + "/" + workspace.getId());
	}
	
	@RequestMapping(value="/workspaces/{workspaceId}", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Workspace get(Principal currentUser, @PathVariable int workspaceId) {
		return workspaceRepository.findById(workspaceId); // FIXME: check user
	}
	
}
