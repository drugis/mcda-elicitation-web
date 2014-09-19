package org.drugis.mcdaweb.standalone.repositories;

import org.drugis.mcdaweb.standalone.model.Remarks;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by connor on 19-9-14.
 */
@Repository
public class JdbcRemarksRepository implements RemarksRepository {
  @Inject
  private JdbcTemplate jdbcTemplate;

  private RowMapper<Remarks> rowMapper = new RowMapper<Remarks>() {
    public Remarks mapRow(ResultSet rs, int rowNum) throws SQLException {
      return new Remarks(rs.getInt("id"), rs.getInt("workspaceId"), rs.getString("remarks"));
    }
  };

  public Remarks find(Integer workspaceId) {
    String sql = "select id, workspaceId, title, state from Remarks where workspaceId = ?";

    return jdbcTemplate.queryForObject(sql, new Object[] {workspaceId}, rowMapper);
  }
}
