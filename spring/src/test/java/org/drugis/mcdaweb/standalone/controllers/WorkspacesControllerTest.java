package org.drugis.mcdaweb.standalone.controllers;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

import java.nio.charset.Charset;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.drugis.mcdaweb.standalone.account.Account;
import org.drugis.mcdaweb.standalone.account.AccountRepository;
import org.drugis.mcdaweb.standalone.repositories.Workspace;
import org.drugis.mcdaweb.standalone.repositories.WorkspaceRepository;
import org.hamcrest.Matchers;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.internal.matchers.Any;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.TextNode;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes= {TestConfig.class})
@WebAppConfiguration
public class WorkspacesControllerTest {
	
	public static final MediaType APPLICATION_JSON_UTF8 = 
			new MediaType(
					MediaType.APPLICATION_JSON.getType(),
					MediaType.APPLICATION_JSON.getSubtype(),                       
					Charset.forName("utf8"));
	private final static String WORKSPACE_PROBLEM = "{\"key\":\"value\"}";
	private static Workspace createWorkspace() {
		int workspaceId = 1;
		int userId = 1;
		int defaultScenarioId = 1;
		final String workspaceName = "mockWorkspace";
		Workspace workspace = new Workspace(workspaceId, userId, defaultScenarioId, workspaceName, WORKSPACE_PROBLEM);
		return workspace;
	}
	
	private MockMvc mockMvc;
	
	@Inject
	private AccountRepository accountRepository;

	@Inject
	private WorkspaceRepository workspaceRepository;

	
	@Autowired
	private WebApplicationContext context;
	
	private Principal user;
	
	@Before
	public void setUp() {
		reset(accountRepository);
		reset(workspaceRepository);

		mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
		user = mock(Principal.class);
		when(user.getName()).thenReturn("gert");
		Account gert = new Account(1, "gert", "Gert", "van Valkenhoef");
		when(accountRepository.findAccountByUsername("gert")).thenReturn(gert);
		
	}
	
	@Test
	public void testQueryEmptyWorkspaces() throws Exception {
		when(workspaceRepository.findByOwnerId(1)).thenReturn(Collections.<Workspace>emptyList());
		
		mockMvc.perform(get("/workspaces").principal(user))
			.andExpect(status().isOk())
			.andExpect(content().contentType(APPLICATION_JSON_UTF8))
			.andExpect(jsonPath("$", hasSize(0)));
		
		verify(workspaceRepository).findByOwnerId(1);
		verify(accountRepository).findAccountByUsername("gert");
	}
	
	@Test
	public void testQueryWorkspaces() throws Exception  {
		Workspace workspace = createWorkspace();
		Collection<Workspace> workspaceCollection = new ArrayList<Workspace>();
		workspaceCollection.add(workspace);
		when(workspaceRepository.findByOwnerId(1)).thenReturn(workspaceCollection);
		
		mockMvc.perform(get("/workspaces").principal(user))
			.andExpect(status().isOk())
			.andExpect(content().contentType(APPLICATION_JSON_UTF8))
			.andExpect(jsonPath("$", hasSize(1)))
			.andExpect(jsonPath("$[0].id", is(workspace.getId())))
			.andExpect(jsonPath("$[0].owner", is(workspace.getOwner())))
			.andExpect(jsonPath("$[0].defaultScenarioId", is(workspace.getDefaultScenarioId())))
			.andExpect(jsonPath("$[0].title", is(workspace.getTitle())))
			.andExpect(jsonPath("$[0].problem", hasKey("key")))
			.andExpect(jsonPath("$[0].problem", hasValue("value")))
		;
		
		verify(workspaceRepository).findByOwnerId(1);
		verify(accountRepository).findAccountByUsername("gert");
	}

	@Test
	public void testCreateWorkspace() throws Exception {
		String jsonContent = "{\"title\": \"mockWorkspace\", \"problem\":" + WORKSPACE_PROBLEM + "}";
		Workspace workspace = createWorkspace();
		when(workspaceRepository.create(workspace.getOwner(), workspace.getTitle(), WORKSPACE_PROBLEM)).thenReturn(workspace);
		mockMvc.perform(post("/workspaces")
				.principal(user)
				.contentType(APPLICATION_JSON_UTF8)
				.content(jsonContent))

				.andExpect(status().isCreated())
				.andExpect(content().contentType(APPLICATION_JSON_UTF8))
				.andExpect(header().string("Location", is("http://localhost:80/workspaces/1")))
				.andExpect(jsonPath("$.id", is(workspace.getId())))
				.andExpect(jsonPath("$.owner", is(workspace.getOwner())))
				.andExpect(jsonPath("$.defaultScenarioId", is(workspace.getDefaultScenarioId())))
				.andExpect(jsonPath("$.title", is(workspace.getTitle())))
				.andExpect(jsonPath("$.problem", hasValue("value")))
				.andExpect(jsonPath("$.problem", hasKey("key")))
		;
		verify(workspaceRepository).create(workspace.getOwner(), workspace.getTitle(), workspace.getProblem() );
		verify(accountRepository).findAccountByUsername("gert");
	}
	
	@Test
	public void testGetWorkspace() throws Exception {
		Workspace workspace = createWorkspace();
		when(workspaceRepository.findById(1, 1)).thenReturn(workspace);
		mockMvc.perform(get("/workspaces/1")
				.principal(user))
				.andExpect(status().isOk())
				.andExpect(content().contentType(APPLICATION_JSON_UTF8))
				.andExpect(jsonPath("$.id", is(workspace.getId())))
				.andExpect(jsonPath("$.owner", is(workspace.getOwner())))
				.andExpect(jsonPath("$.defaultScenarioId", is(workspace.getDefaultScenarioId())))
				.andExpect(jsonPath("$.title", is(workspace.getTitle())))
				.andExpect(jsonPath("$.problem", hasKey("key")))
				.andExpect(jsonPath("$.problem", hasValue("value")))
		;
				
		verify(workspaceRepository).findById(1, 1);
		verify(accountRepository).findAccountByUsername("gert");
	}
	
	@Test
	public void testGetUnauthorisedWorkspaceFails() throws Exception {
		Principal leetHaxor = mock(Principal.class);
		when(leetHaxor.getName()).thenReturn("skiddie");
		Account haxAccount = new Account(2, "skiddie", "Script", "Kiddie");
		when(accountRepository.findAccountByUsername("skiddie")).thenReturn(haxAccount);

		when(workspaceRepository.findById(1, 2)).thenReturn(null);
		mockMvc.perform(get("/workspaces/1")
				.principal(leetHaxor))
				.andExpect(status().isNotFound())
		;
		verify(accountRepository).findAccountByUsername("skiddie");
		verify(workspaceRepository).findById(1, 2);
	}
	
	@Test
	public void testUpdate() throws Exception {
	
		String jsonContent = "{\"id\": 1, \"owner\": 1, \"title\": \"mockWorkspace\", \"defaultScenarioId\" : 1, \"problem\":" + WORKSPACE_PROBLEM + "}";
		Integer userId = 1;
		Workspace workspace = createWorkspace();
		when(workspaceRepository.update(workspace, userId)).thenReturn(workspace);
		mockMvc.perform(post("/workspaces/202").principal(user)
				.contentType(APPLICATION_JSON_UTF8)
				.content(jsonContent))
				.andExpect(status().isOk())
				.andExpect(content().contentType(APPLICATION_JSON_UTF8))
				.andExpect(jsonPath("$.id", is(workspace.getId())))
				.andExpect(jsonPath("$.owner", is(workspace.getOwner())))
				.andExpect(jsonPath("$.defaultScenarioId", is(workspace.getDefaultScenarioId())))
				.andExpect(jsonPath("$.title", is(workspace.getTitle())))
				.andExpect(jsonPath("$.problem", hasKey("key")))
				.andExpect(jsonPath("$.problem", hasValue("value")))
		;
		
		verify(workspaceRepository).update(workspace, userId);
		verify(accountRepository).findAccountByUsername("gert");
	}
	
	@Ignore
	@Test
	public void testInvalidUpdate() throws Exception {
		String jsonContent = "{\"id\": 2, \"owner\": 1, \"title\": \"mockWorkspace\", \"defaultScenarioId\" : 1, \"problem\":" + WORKSPACE_PROBLEM + "}";
		Integer userId = 1;
		Workspace workspace = createWorkspace();
		when(workspaceRepository.update(workspace, userId)).thenReturn(workspace);
		mockMvc.perform(post("/workspaces/202").principal(user)
				.contentType(APPLICATION_JSON_UTF8)
				.content(jsonContent))
				.andExpect(status().isBadRequest())
		;
		verify(workspaceRepository).update(workspace, userId);
}
	
	@After
	public void tearDown() {
		verifyNoMoreInteractions(accountRepository, workspaceRepository);
	}

}
