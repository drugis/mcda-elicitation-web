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
public class JdbcScenarioRepository implements ScenarioRepository {
	@Inject
	private JdbcTemplate jdbcTemplate;
	
	private RowMapper<Scenario> rowMapper = new RowMapper<Scenario>() {
		public Scenario mapRow(ResultSet rs, int rowNum) throws SQLException {
			return new Scenario(rs.getInt("id"), rs.getInt("workspace"), rs.getString("title"), rs.getString("state"));
		}
	};

	@Transactional
	public Scenario create(int workspaceId, String title, String state) {
		PreparedStatementCreatorFactory pscf = 
				new PreparedStatementCreatorFactory("insert into Scenario (workspace, title, state) values (?, ?, ?)");
		pscf.addParameter(new SqlParameter(Types.INTEGER));
		pscf.addParameter(new SqlParameter(Types.VARCHAR));
		pscf.addParameter(new SqlParameter(Types.VARCHAR));
		
		KeyHolder keyHolder = new GeneratedKeyHolder();
		jdbcTemplate.update(
				pscf.newPreparedStatementCreator(new Object[] {workspaceId, title, state}), keyHolder);
		int scenarioId = (Integer) keyHolder.getKey();
		return new Scenario(scenarioId, workspaceId, title, state);
	}

	@Transactional
	public Scenario update(int scenarioId, String title, String state) {
		PreparedStatementCreatorFactory pscf = 
				new PreparedStatementCreatorFactory("UPDATE Scenario SET title = ?, state = ? WHERE id = ?");
		pscf.addParameter(new SqlParameter(Types.VARCHAR));
		pscf.addParameter(new SqlParameter(Types.VARCHAR));
		pscf.addParameter(new SqlParameter(Types.INTEGER));
		
		jdbcTemplate.update(
				pscf.newPreparedStatementCreator(new Object[] {title, state, scenarioId}));
		return findById(scenarioId);
	}

	@Override
	public Collection<Scenario> findByWorkspace(int workspaceId) {
		PreparedStatementCreatorFactory pscf = 
				new PreparedStatementCreatorFactory("select id, workspace, title, state from Scenario where workspace = ?");
		pscf.addParameter(new SqlParameter(Types.INTEGER));

		return jdbcTemplate.query(
				pscf.newPreparedStatementCreator(new Object[] { workspaceId }), rowMapper);
	}

	@Override
	public Scenario findById(int scenarioId) {
		return jdbcTemplate.queryForObject(
				"select id, workspace, title, state from Scenario where id = ?",
				rowMapper, scenarioId);
	}

}
