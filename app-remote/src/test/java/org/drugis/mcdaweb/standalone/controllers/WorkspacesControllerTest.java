package org.drugis.mcdaweb.standalone.controllers;

import org.drugis.mcdaweb.standalone.account.Account;
import org.drugis.mcdaweb.standalone.account.AccountRepository;
import org.drugis.mcdaweb.standalone.model.Remarks;
import org.drugis.mcdaweb.standalone.repositories.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.inject.Inject;
import java.nio.charset.Charset;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes= {TestConfig.class})
@WebAppConfiguration
public class WorkspacesControllerTest {
	
	public static final MediaType APPLICATION_JSON_UTF8 = 
			new MediaType(
					MediaType.APPLICATION_JSON.getType(),
					MediaType.APPLICATION_JSON.getSubtype(),                       
					Charset.forName("utf8"));
	private final static String JSON_KEY_VALUE = "{\"key\":\"value\"}";
	private static Workspace createWorkspace() {
		int workspaceId = 1;
		int userId = 1;
		int defaultScenarioId = 1;
		final String workspaceName = "mockWorkspace";
		Workspace workspace = new Workspace(workspaceId, userId, defaultScenarioId, workspaceName, JSON_KEY_VALUE);
		return workspace;
	}
	
	private Scenario createScenario(int scenarioId, int workspaceId, String title) {
		return new Scenario(scenarioId, workspaceId, title, JSON_KEY_VALUE);
	}
	
	private MockMvc mockMvc;
	
	@Inject
	private AccountRepository accountRepository;

	@Inject
	private WorkspaceRepository workspaceRepository;

	@Inject
	private ScenarioRepository scenarioRepository;

  @Inject
  private RemarksRepository remarksRepository;
	
	@Autowired
	private WebApplicationContext context;
	
	private Principal user;
	
	@Before
	public void setUp() {
		reset(accountRepository);
		reset(workspaceRepository);
		reset(scenarioRepository);

		mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
		user = mock(Principal.class);
		when(user.getName()).thenReturn("gert");
		Account gert = new Account(1, "gert", "Gert", "van Valkenhoef");
		when(accountRepository.findAccountByUsername("gert")).thenReturn(gert);
		
	}
	
	@Test
	public void testBadURL404() throws Exception {
		mockMvc.perform(get("nonsenseUrl"))
			.andExpect(status().isNotFound());
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
			.andExpect(jsonPath("$[0].problem.key", is("value")))
		;
		
		verify(workspaceRepository).findByOwnerId(1);
		verify(accountRepository).findAccountByUsername("gert");
	}

	@Test
	public void testCreateWorkspace() throws Exception {
		String jsonContent = "{\"title\": \"mockWorkspace\", \"problem\":" + JSON_KEY_VALUE + "}";
		Workspace workspace = createWorkspace();
		when(workspaceRepository.create(workspace.getOwner(), workspace.getTitle(), JSON_KEY_VALUE)).thenReturn(workspace);
		mockMvc.perform(post("/workspaces")
				.principal(user)
				.contentType(APPLICATION_JSON_UTF8)
				.content(jsonContent))

				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
				.andExpect(header().string("Location", is("http://localhost:80/workspaces/1")))
				.andExpect(jsonPath("$.id", is(workspace.getId())))
				.andExpect(jsonPath("$.owner", is(workspace.getOwner())))
				.andExpect(jsonPath("$.defaultScenarioId", is(workspace.getDefaultScenarioId())))
				.andExpect(jsonPath("$.title", is(workspace.getTitle())))
				.andExpect(jsonPath("$.problem.key", is("value")))
		;
		verify(workspaceRepository).create(workspace.getOwner(), workspace.getTitle(), workspace.getProblem() );
		verify(accountRepository).findAccountByUsername("gert");
	}
	
	@Test
	public void testGetWorkspace() throws Exception {
		Workspace workspace = createWorkspace();
		int workspaceId = 1;
		int userId = 1;
		when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
		when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(true);
		mockMvc.perform(get("/workspaces/1")
				.principal(user))
				.andExpect(status().isOk())
				.andExpect(content().contentType(APPLICATION_JSON_UTF8))
				.andExpect(jsonPath("$.id", is(workspace.getId())))
				.andExpect(jsonPath("$.owner", is(workspace.getOwner())))
				.andExpect(jsonPath("$.defaultScenarioId", is(workspace.getDefaultScenarioId())))
				.andExpect(jsonPath("$.title", is(workspace.getTitle())))
				.andExpect(jsonPath("$.problem.key", is("value")))
		;
		verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
		verify(workspaceRepository).findById(1);
		verify(accountRepository).findAccountByUsername("gert");
	}
	
	@Test
	public void testGetNonexistentWorkspaceFails() throws Exception {
		int workspaceId = 1;
		when(workspaceRepository.findById(workspaceId)).thenReturn(null);
	
		mockMvc.perform(get("/workspaces/1")
				.principal(user))
        .andExpect(status().isNotFound());

		verify(workspaceRepository).findById(workspaceId);
	}
	
	@Test
	public void testGetUnauthorisedWorkspaceFails() throws Exception {
		Principal leetHaxor = mock(Principal.class);
		when(leetHaxor.getName()).thenReturn("skiddie");
		int workspaceId = 1;
		int userId = 2;
		Workspace workspace = createWorkspace();
		Account haxAccount = new Account(userId, "skiddie", "Script", "Kiddie");
		when(accountRepository.findAccountByUsername("skiddie")).thenReturn(haxAccount);
		when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(false);
		when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
		mockMvc.perform(get("/workspaces/1")
				.principal(leetHaxor))
				.andExpect(status().isForbidden())
		;
		verify(workspaceRepository).findById(workspaceId);
		verify(accountRepository).findAccountByUsername("skiddie");
		verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
	}

    @Test
    public void testGetWorkSpaceResourceDoesNotExistException() throws Exception {
        Workspace workspace = createWorkspace();
        int workspaceId = 1;
        int userId = 1;
        when(workspaceRepository.findById(workspaceId)).thenReturn(null);
        when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(true);
        mockMvc.perform(get("/workspaces/1")
                .principal(user))
                .andExpect(status().isNotFound());
        verify(workspaceRepository).findById(1);
    }

    @Test
    public void testGetWorkSpaceResourceNotOwnedException() throws Exception {
        Workspace workspace = createWorkspace();
        int workspaceId = 1;
        int userId = 1;
        when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
        when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(false);
        mockMvc.perform(get("/workspaces/1")
                .principal(user))
                .andExpect(status().isForbidden());
        verify(workspaceRepository).findById(1);
        verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
        verify(accountRepository).findAccountByUsername("gert");
    }
	
	@Test
	public void testUpdateWorkspace() throws Exception {
		String jsonContent = "{\"id\": 1, \"owner\": 1, \"title\": \"mockWorkspace\", \"defaultScenarioId\" : 1, \"problem\":" + JSON_KEY_VALUE + "}";
		Workspace workspace = createWorkspace();
		int workspaceId = 1;
		int userId = 1;
		when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
		when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(true);
		when(workspaceRepository.update(workspace)).thenReturn(workspace);
		mockMvc.perform(post("/workspaces/1").principal(user)
			.contentType(APPLICATION_JSON_UTF8)
			.content(jsonContent))
			.andExpect(status().isOk())
			.andExpect(content().contentType(APPLICATION_JSON_UTF8))
			.andExpect(jsonPath("$.id", is(workspace.getId())))
			.andExpect(jsonPath("$.owner", is(workspace.getOwner())))
			.andExpect(jsonPath("$.defaultScenarioId", is(workspace.getDefaultScenarioId())))
			.andExpect(jsonPath("$.title", is(workspace.getTitle())))
			.andExpect(jsonPath("$.problem.key", is("value")))
		;
		verify(workspaceRepository).findById(workspaceId);
		verify(workspaceRepository).update(workspace);
		verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
		verify(accountRepository).findAccountByUsername("gert");
	}

	@Test
	public void testQueryEmptyScenarios() throws Exception {
		int workspaceId = 0;
		int userId = 1;
		Workspace workspace = createWorkspace();
		when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
		when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(true);
		when(scenarioRepository.findByWorkspace(workspaceId)).thenReturn(Collections.<Scenario>emptyList());
		mockMvc.perform(get("/workspaces/0/scenarios").principal(user))
			.andExpect(status().isOk())
			.andExpect(content().contentType(APPLICATION_JSON_UTF8))
			.andExpect(jsonPath("$", hasSize(0)))
		;
		verify(workspaceRepository).findById(workspaceId);
		verify(scenarioRepository).findByWorkspace(workspaceId);
		verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
		verify(accountRepository).findAccountByUsername("gert");
	}
	
	@Test
	public void testQueryScenarios() throws Exception {
		int workspaceId = 0;
		int userId = 1;
		Workspace workspace = createWorkspace();
		when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
		when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(true);
		when(scenarioRepository.findByWorkspace(0)).thenReturn(Collections.<Scenario>emptyList());
		Scenario scenario0 = createScenario(0, 0, "testScenario0");
		Scenario scenario1 = createScenario(1, 0, "testScenario1");
		Collection<Scenario> scenarios = new ArrayList<Scenario>(Arrays.asList(scenario0, scenario1));
		
		when(scenarioRepository.findByWorkspace(workspaceId)).thenReturn(scenarios);
		
		mockMvc.perform(get("/workspaces/0/scenarios").principal(user))
			.andExpect(status().isOk())
			.andExpect(content().contentType(APPLICATION_JSON_UTF8))
			.andExpect(jsonPath("$", hasSize(2)))
			.andExpect(jsonPath("$[0].id", is(0)))
			.andExpect(jsonPath("$[1].id", is(1)))
		;
		verify(scenarioRepository).findByWorkspace(workspaceId);
		verify(workspaceRepository).findById(workspaceId);
		verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
		verify(accountRepository).findAccountByUsername("gert");
	}

	@Test
	public void testCreateScenario() throws Exception {
		int workspaceId = 1;
		int userId = 1;
		String title = "scenarioTitle";
		Workspace workspace = createWorkspace();
		int scenarioId = 0;
		Scenario scenario = createScenario(scenarioId, workspaceId, title);
		when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
		when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(true);
		when(scenarioRepository.create(scenario.getWorkspace(), scenario.getTitle(), JSON_KEY_VALUE)).thenReturn(scenario);

		String jsonContent = "{\"id\": 0, \"title\": \"" + title + "\", \"state\": " + JSON_KEY_VALUE + "}";
		mockMvc.perform(post("/workspaces/1/scenarios")
			.principal(user)
			.contentType(APPLICATION_JSON_UTF8)
			.content(jsonContent ))
			.andExpect(status().isCreated())
			.andExpect(content().contentType(APPLICATION_JSON_UTF8))
			.andExpect(jsonPath("$.id", is(0)))
		;
		verify(workspaceRepository).findById(workspaceId);
		verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
		verify(scenarioRepository).create(workspaceId, title, JSON_KEY_VALUE);
		verify(accountRepository).findAccountByUsername("gert");
	}
	
	@Test
	public void testGetScenario() throws Exception {
		int workspaceId = 1;
		int userId = 1;
		Workspace workspace = createWorkspace();
		when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
		when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(true);
		int scenarioId = 1;
		Scenario scenario = createScenario(scenarioId, workspaceId, "title");
		when(scenarioRepository.findById(scenarioId)).thenReturn(scenario );
		mockMvc.perform(get("/workspaces/1/scenarios/1").principal(user))
			.andExpect(status().isOk())
			.andExpect(content().contentType(APPLICATION_JSON_UTF8))
			.andExpect(jsonPath("$.id", is(1)))
			.andExpect(jsonPath("$.workspace", is(1)))
			.andExpect(jsonPath("$.title", is("title")))
			.andExpect(jsonPath("$.state.key", is("value")))
		;
		verify(scenarioRepository).findById(scenarioId);
		verify(workspaceRepository).findById(workspaceId);
		verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
		verify(accountRepository).findAccountByUsername("gert");
	}
	
	@Test
	public void testGetNonexistentScenarioFails() throws Exception {
		int workspaceId = 1;
		int userId = 1;
		Workspace workspace = createWorkspace();
		when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
		when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(true);
		int scenarioId = 2;
		when(scenarioRepository.findById(scenarioId)).thenReturn(null);

		mockMvc.perform(get("/workspaces/1/scenarios/2").principal(user))
            .andExpect(status().isNotFound());

		verify(scenarioRepository).findById(scenarioId);
		verify(workspaceRepository).findById(workspaceId);
		verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
		verify(accountRepository).findAccountByUsername("gert");
	}
	
	@Test
	public void testGetScenarioNotInWorkspace() throws Exception {
		int workspaceId = 1;
		int userId = 1;
		Workspace workspace = createWorkspace();
		when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
		when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(true);
		int scenarioId = 2;
		Scenario scenario = createScenario(scenarioId, workspaceId + 1, "title");
		when(scenarioRepository.findById(scenarioId)).thenReturn(scenario);
		mockMvc.perform(get("/workspaces/1/scenarios/2").principal(user))
            .andExpect(status().isForbidden());

		verify(workspaceRepository).findById(workspaceId);
		verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
		verify(scenarioRepository).findById(scenarioId);
		verify(accountRepository).findAccountByUsername("gert");
	}
	
	@Test
	public void testUpdateScenario() throws Exception {
		int workspaceId = 1;
		int userId = 1;
		Workspace workspace = createWorkspace();
		when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
		when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(true);
		int scenarioId = 1;
		String scenarioTitle = "scenarioTitle";
		Scenario scenario = createScenario(scenarioId, workspaceId, scenarioTitle);
		when(scenarioRepository.findById(scenarioId)).thenReturn(scenario);
		String jsonContent = "{\"id\": 1, \"title\": \"scenarioTitle\", \"state\": " + JSON_KEY_VALUE + "}";
		when(scenarioRepository.update(scenarioId, scenarioTitle, JSON_KEY_VALUE)).thenReturn(scenario);
		
		mockMvc.perform(post("/workspaces/1/scenarios/1")
			.principal(user)
			.contentType(APPLICATION_JSON_UTF8)
			.content(jsonContent))
			.andExpect(status().isOk())
			.andExpect(content().contentType(APPLICATION_JSON_UTF8))
			.andExpect(jsonPath("$.id", is(scenarioId)))
			.andExpect(jsonPath("$.title", is(scenarioTitle)));
			
		verify(workspaceRepository).findById(workspaceId);
		verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
		verify(scenarioRepository).findById(scenarioId);
		verify(scenarioRepository).update(scenarioId, scenarioTitle, JSON_KEY_VALUE);
		verify(accountRepository).findAccountByUsername("gert");
	}

  @Test
  public void testGetRemarks() throws Exception {
    Integer remarksId = 1;
    String remarksStr = "{" +
            "\"HAM-D responders\":\"test content 1\"" +
            "}";
    Integer workspaceId = 2;
    Remarks remarks = new Remarks(remarksId, workspaceId, remarksStr);
    when(remarksRepository.find(workspaceId)).thenReturn(remarks);
    mockMvc.perform(get("/workspaces/2/remarks").principal(user))
            .andExpect(status().isOk())
            .andExpect(content().contentType(APPLICATION_JSON_UTF8))
            .andExpect(jsonPath("$.id", is(remarksId)))
            .andExpect(jsonPath("$.workspaceId", is(workspaceId)));
    verify(remarksRepository).find(workspaceId);
  }

  @Test
  public void testSaveNewRemarks() throws Exception {
    Integer workspaceId = 1;
    Integer userId = 1;
    Workspace workspace = createWorkspace();
    Remarks remarks = new Remarks(workspaceId, "test content yo!");
    String content = "{\"id\" : null, \"workspaceId\" : 1, \"remarks\" : \"test content yo!\"}";
    when(workspaceRepository.findById(workspaceId)).thenReturn(workspace);
    when(workspaceRepository.isWorkspaceOwnedBy(workspaceId, userId)).thenReturn(true);
    when(remarksRepository.create(anyInt(), anyString())).thenReturn(new Remarks(1, remarks.getWorkspaceId(), remarks.getRemarks()));
    mockMvc.perform(post("/workspaces/1/remarks").principal(user).content(content).contentType(APPLICATION_JSON_UTF8))
            .andExpect(status().isCreated())
            .andExpect(content().contentType(APPLICATION_JSON_UTF8))
            .andExpect(jsonPath("$.workspaceId", is(workspaceId)));
    verify(workspaceRepository).findById(workspaceId);
    verify(workspaceRepository).isWorkspaceOwnedBy(workspaceId, userId);
    verify(remarksRepository).create(anyInt(), anyString());
    verify(accountRepository).findAccountByUsername("gert");
  }

  @Test
  public void updateRemarks() {

  }


  @After
	public void tearDown() {
		verifyNoMoreInteractions(accountRepository, workspaceRepository, remarksRepository);
	}

}
