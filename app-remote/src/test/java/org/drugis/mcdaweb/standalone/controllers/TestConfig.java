package org.drugis.mcdaweb.standalone.controllers;

import org.drugis.mcdaweb.standalone.account.AccountRepository;
import org.drugis.mcdaweb.standalone.repositories.RemarksRepository;
import org.drugis.mcdaweb.standalone.repositories.ScenarioRepository;
import org.drugis.mcdaweb.standalone.repositories.WorkspaceRepository;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "org.drugis.mcdaweb.standalone.controllers", excludeFilters = { @Filter(Configuration.class) })
public class TestConfig {
	@Bean
	public AccountRepository mockAccountRepository() {
		return Mockito.mock(AccountRepository.class);
	}
	
	@Bean
	public ScenarioRepository mockScenarioRepository() {
		return Mockito.mock(ScenarioRepository.class);
	}
	
	@Bean
	public WorkspaceRepository mockWorkspaceRepository() {
		return Mockito.mock(WorkspaceRepository.class);
	}

  @Bean
  public RemarksRepository mockRemarksRepository() {
    return Mockito.mock(RemarksRepository.class);
  }
}
