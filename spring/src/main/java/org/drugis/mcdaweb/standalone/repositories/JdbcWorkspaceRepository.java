package org.drugis.mcdaweb.standalone.repositories;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Collection;

import javax.inject.Inject;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreatorFactory;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class JdbcWorkspaceRepository implements WorkspaceRepository {
	@Inject
	private JdbcTemplate jdbcTemplate;
	
	private RowMapper<Workspace> rowMapper = new RowMapper<Workspace>() {
		public Workspace mapRow(ResultSet rs, int rowNum) throws SQLException {
			return new Workspace(rs.getInt("id"), rs.getInt("owner"), rs.getInt("defaultScenarioId"), rs.getString("title"), rs.getString("problem"));
		}
	};
	
	@Transactional
	public Workspace create(int ownerId, String title, String problem) {
		PreparedStatementCreatorFactory pscf = 
				new PreparedStatementCreatorFactory("insert into Workspace (owner, title, problem) values (?, ?, ?)");
		pscf.addParameter(new SqlParameter(Types.INTEGER));
		pscf.addParameter(new SqlParameter(Types.VARCHAR));
		pscf.addParameter(new SqlParameter(Types.VARCHAR));
		
		KeyHolder keyHolder = new GeneratedKeyHolder();
		jdbcTemplate.update(
				pscf.newPreparedStatementCreator(new Object[] {ownerId, title, problem}), keyHolder);
		int workspaceId = (Integer) keyHolder.getKey();
		
		return new Workspace(workspaceId, ownerId, null, title, problem);
	}

	@Override
	public Collection<Workspace> findByOwnerId(int ownerId) {
		PreparedStatementCreatorFactory pscf = 
				new PreparedStatementCreatorFactory("select id, owner, defaultScenarioId, title, problem from Workspace where owner = ?");
		pscf.addParameter(new SqlParameter(Types.INTEGER));
		return jdbcTemplate.query(
				pscf.newPreparedStatementCreator(new Object[] { ownerId }), rowMapper);
	}

	@Override
	public Workspace findById(int workspaceId) {
		return jdbcTemplate.queryForObject(
				"select id, owner, defaultScenarioId, title, problem from Workspace where id = ?",
				rowMapper, workspaceId);
	}

	@Transactional
	public Workspace update(Workspace workspace) {
		PreparedStatementCreatorFactory pscf = 
				new PreparedStatementCreatorFactory("UPDATE Workspace SET title = ?, problem = ?, defaultScenarioId = ? WHERE id = ?");
		pscf.addParameter(new SqlParameter(Types.VARCHAR));
		pscf.addParameter(new SqlParameter(Types.VARCHAR));
		pscf.addParameter(new SqlParameter(Types.INTEGER));
		pscf.addParameter(new SqlParameter(Types.INTEGER));

		jdbcTemplate.update(
				pscf.newPreparedStatementCreator(new Object[] {workspace.getTitle(), workspace.getProblem(), workspace.getDefaultScenarioId(), workspace.getId()}));
		return findById(workspace.getId());
	}

}