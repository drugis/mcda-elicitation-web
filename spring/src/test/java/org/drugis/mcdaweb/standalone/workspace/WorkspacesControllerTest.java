package org.drugis.mcdaweb.standalone.workspace;

import java.nio.charset.Charset;
import java.security.Principal;
import java.util.Collections;

import javax.inject.Inject;

import org.drugis.mcdaweb.standalone.account.Account;
import org.drugis.mcdaweb.standalone.account.AccountRepository;
import org.drugis.mcdaweb.standalone.repositories.Workspace;
import org.drugis.mcdaweb.standalone.repositories.WorkspaceRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.Mockito.*;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
		Mockito.reset(accountRepository);
		Mockito.reset(workspaceRepository);

		mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
		user = Mockito.mock(Principal.class);
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
		
		verify(accountRepository).findAccountByUsername("gert");
		verify(workspaceRepository).findByOwnerId(1);
	}
	
	@After
	public void tearDown() {
		verifyNoMoreInteractions(accountRepository, workspaceRepository);
	}

}
