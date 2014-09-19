package org.drugis.mcdaweb.standalone.repositories;

import org.drugis.mcdaweb.standalone.model.Remarks;
import org.springframework.jdbc.core.*;

import javax.inject.Inject;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

/**
 * Created by connor on 19-9-14.
 */
public class RemarksRepository {
  @Inject
  private JdbcTemplate jdbcTemplate;

  private RowMapper<Remarks> rowMapper = new RowMapper<Remarks>() {
    public Remarks mapRow(ResultSet rs, int rowNum) throws SQLException {
      return new Remarks(rs.getInt("id"), rs.getInt("workspaceId"), rs.getString("remarks"));
    }
  };

  public Remarks find(Integer workspaceId) {
    PreparedStatementCreatorFactory pscf =
            new PreparedStatementCreatorFactory("select id, workspaceId, title, state from Remarks where workspaceId = ?");
    pscf.addParameter(new SqlParameter(Types.INTEGER));

    List jdbcTemplate.query(pscf.newPreparedStatementCreator(new Object[]{workspaceId}), rowMapper).get(0);
  }
}
