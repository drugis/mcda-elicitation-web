package org.drugis.mcdaweb.standalone.repositories;

import static org.apache.commons.collections.CollectionUtils.isNotEmpty;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Collection;
import java.util.List;

import javax.inject.Inject;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
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
	public Workspace create(final int ownerId, final String title, final String problem) {
		KeyHolder keyHolder = new GeneratedKeyHolder();
		jdbcTemplate.update(new PreparedStatementCreator() {
			@Override
			public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
				PreparedStatement ps = con.prepareStatement("INSERT INTO Workspace (owner, title, problem) VALUES (?, ?, ?)", new String[] {"id"});
				ps.setInt(1, ownerId);
				ps.setString(2, title);
				ps.setString(3, problem);
				return ps;
			}
		}, keyHolder);
		int workspaceId = (Integer) keyHolder.getKey();
		
		return new Workspace(workspaceId, ownerId, null, title, problem);
	}

	@Override
	public Collection<Workspace> findByOwnerId(int ownerId) {
		PreparedStatementCreatorFactory pscf = 
				new PreparedStatementCreatorFactory("SELECT id, owner, defaultScenarioId, title, problem FROM Workspace WHERE owner = ?");
		pscf.addParameter(new SqlParameter(Types.INTEGER));
		return jdbcTemplate.query(
				pscf.newPreparedStatementCreator(new Object[] { ownerId }), rowMapper);
	}

	@Override
	public Workspace findById(int workspaceId) {
		Workspace workspace;
		try {
			workspace = jdbcTemplate.queryForObject(
					"select id, owner, defaultScenarioId, title, problem from Workspace where id = ?",
					rowMapper, workspaceId);
		} catch (EmptyResultDataAccessException e ) {
			workspace = null;
		}
		return workspace;
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

	@Override
	public boolean isWorkspaceOwnedBy(int workspaceId, int userId) {
		PreparedStatementCreatorFactory pscf = 
				new PreparedStatementCreatorFactory("SELECT * FROM Workspace WHERE id = ? AND owner = ?");
		pscf.addParameter(new SqlParameter(Types.INTEGER));
		pscf.addParameter(new SqlParameter(Types.INTEGER));

		List<Workspace> query = jdbcTemplate.query(pscf.newPreparedStatementCreator(new Object[] {workspaceId, userId}), rowMapper);
		return isNotEmpty(query);
	}

}