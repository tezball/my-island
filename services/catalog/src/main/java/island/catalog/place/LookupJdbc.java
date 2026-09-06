package island.catalog.place;

import island.catalog.api.dto.CategoryResponse;
import island.catalog.api.dto.CountyResponse;
import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class LookupJdbc {

  private final JdbcClient jdbc;

  public LookupJdbc(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  public List<CategoryResponse> categories() {
    return jdbc.sql(
            """
            select id, label, guest_verb
            from category
            order by sort_order
            """)
        .query(
            (rs, n) ->
                new CategoryResponse(
                    rs.getString("id"), rs.getString("label"), rs.getString("guest_verb")))
        .list();
  }

  public List<CountyResponse> counties() {
    return jdbc.sql(
            """
            select id, name, country_code, ni
            from county
            order by name
            """)
        .query(
            (rs, n) ->
                new CountyResponse(
                    rs.getString("id"),
                    rs.getString("name"),
                    rs.getString("country_code"),
                    rs.getBoolean("ni")))
        .list();
  }

  public boolean categoryExists(String id) {
    return jdbc.sql("select count(*) from category where id = :id")
            .param("id", id)
            .query(Integer.class)
            .single()
        > 0;
  }

  public boolean countyExists(String id) {
    return jdbc.sql("select count(*) from county where id = :id")
            .param("id", id)
            .query(Integer.class)
            .single()
        > 0;
  }

  public boolean facilityExists(String id) {
    return jdbc.sql("select count(*) from facility where id = :id")
            .param("id", id)
            .query(Integer.class)
            .single()
        > 0;
  }
}
