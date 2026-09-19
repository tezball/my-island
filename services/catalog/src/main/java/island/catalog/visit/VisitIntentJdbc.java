package island.catalog.visit;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class VisitIntentJdbc {

  private final JdbcClient jdbc;

  public VisitIntentJdbc(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  public Optional<VisitIntent> find(UUID guestId, UUID placeId) {
    return jdbc.sql(
            """
            select guest_id, place_id, mark, updated_at
            from visit_intent
            where guest_id = :guestId and place_id = :placeId
            """)
        .param("guestId", guestId)
        .param("placeId", placeId)
        .query(
            (rs, n) ->
                new VisitIntent(
                    rs.getObject("guest_id", UUID.class),
                    rs.getObject("place_id", UUID.class),
                    rs.getString("mark"),
                    rs.getTimestamp("updated_at").toInstant()))
        .optional();
  }

  public VisitIntent upsert(UUID guestId, UUID placeId, String mark) {
    jdbc.sql(
            """
            insert into visit_intent (guest_id, place_id, mark)
            values (:guestId, :placeId, :mark)
            on conflict (guest_id, place_id) do update
              set mark = excluded.mark, updated_at = now()
            """)
        .param("guestId", guestId)
        .param("placeId", placeId)
        .param("mark", mark)
        .update();
    return find(guestId, placeId).orElseThrow();
  }

  public List<VisitIntent> listByGuest(UUID guestId, String mark) {
    StringBuilder sql =
        new StringBuilder(
            """
            select guest_id, place_id, mark, updated_at
            from visit_intent
            where guest_id = :guestId
            """);
    if (mark != null) {
      sql.append(" and mark = :mark");
    }
    sql.append(" order by updated_at desc");
    var spec = jdbc.sql(sql.toString()).param("guestId", guestId);
    if (mark != null) {
      spec = spec.param("mark", mark);
    }
    return spec.query(
            (rs, n) ->
                new VisitIntent(
                    rs.getObject("guest_id", UUID.class),
                    rs.getObject("place_id", UUID.class),
                    rs.getString("mark"),
                    rs.getTimestamp("updated_at").toInstant()))
        .list();
  }

  public void delete(UUID guestId, UUID placeId) {
    jdbc.sql("delete from visit_intent where guest_id = :guestId and place_id = :placeId")
        .param("guestId", guestId)
        .param("placeId", placeId)
        .update();
  }

  public void audit(
      UUID guestId, UUID placeId, String oldMark, String newMark, String action) {
    jdbc.sql(
            """
            insert into visit_intent_audit (guest_id, place_id, old_mark, new_mark, action)
            values (:guestId, :placeId, :oldMark, :newMark, :action)
            """)
        .param("guestId", guestId)
        .param("placeId", placeId)
        .param("oldMark", oldMark)
        .param("newMark", newMark)
        .param("action", action)
        .update();
  }

}
