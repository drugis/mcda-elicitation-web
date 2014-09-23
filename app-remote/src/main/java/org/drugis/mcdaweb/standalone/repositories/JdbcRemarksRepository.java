package org.drugis.mcdaweb.standalone.repositories;

import org.drugis.mcdaweb.standalone.model.Remarks;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.sql.*;
import java.util.List;

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

  public Remarks find(Integer workspaceId) throws Exception {

      PreparedStatementCreatorFactory pscf =
              new PreparedStatementCreatorFactory("select id, workspaceId, remarks from Remarks where workspaceId = ?");
      pscf.addParameter(new SqlParameter(Types.INTEGER));

      List<Remarks> result =  jdbcTemplate.query(
              pscf.newPreparedStatementCreator(new Object[] { workspaceId }), rowMapper);

      if(result.size() == 0) {
          return null;
      } else if(result.size() == 1) {
          return result.get(0);
      } else {
          throw new Exception("expected one or zero remarks but got more than one");
      }
  }

  @Override
  public Remarks create(final Integer workspaceId, final String remarks) {
    KeyHolder keyHolder = new GeneratedKeyHolder();
    jdbcTemplate.update(new PreparedStatementCreator() {
      @Override
      public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
        PreparedStatement ps = con.prepareStatement("insert into Remarks (workspaceId, remarks) values (?, ?)", new String[] {"id"});
        ps.setInt(1, workspaceId);
        ps.setString(2, remarks);
        return ps;
      }
    }, keyHolder);
    int remarksId = (Integer) keyHolder.getKey();
    return new Remarks(remarksId, workspaceId, remarks);
  }

}
