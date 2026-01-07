package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.model.BookingExtraModel;
import com.example.myislandapi.model.BookingModel;
import com.example.myislandapi.repository.rowmapper.BookingExtraRowMapper;
import com.example.myislandapi.repository.rowmapper.BookingRowMapper;
import com.example.myislandapi.util.AuditingUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.*;

@Repository
public class JdbcBookingRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final BookingRowMapper rowMapper;
    private final BookingExtraRowMapper bookingExtraRowMapper;

    public JdbcBookingRepository(NamedParameterJdbcTemplate jdbc, BookingRowMapper rowMapper, BookingExtraRowMapper bookingExtraRowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
        this.bookingExtraRowMapper = bookingExtraRowMapper;
    }

    public Optional<BookingModel> findById(UUID id) {
        String sql = "SELECT * FROM bookings WHERE id = :id";
        List<BookingModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        if (!results.isEmpty()) {
            loadBookingExtras(results);
        }
        return results.stream().findFirst();
    }

    public Page<BookingModel> findByUserId(UUID userId, Pageable pageable) {
        String sql = "SELECT * FROM bookings WHERE user_id = :userId ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<BookingModel> content = jdbc.query(sql,
            Map.of("userId", userId, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadBookingExtras(content);

        String countSql = "SELECT COUNT(*) FROM bookings WHERE user_id = :userId";
        Long total = jdbc.queryForObject(countSql, Map.of("userId", userId), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<BookingModel> findByUserIdAndStatus(UUID userId, BookingStatus status, Pageable pageable) {
        String sql = "SELECT * FROM bookings WHERE user_id = :userId AND status = :status ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        List<BookingModel> content = jdbc.query(sql,
            Map.of("userId", userId, "status", status.name(), "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadBookingExtras(content);

        String countSql = "SELECT COUNT(*) FROM bookings WHERE user_id = :userId AND status = :status";
        Long total = jdbc.queryForObject(countSql, Map.of("userId", userId, "status", status.name()), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<BookingModel> findByOwnerId(UUID ownerId, Pageable pageable) {
        String sql = """
            SELECT b.* FROM bookings b
            JOIN lots l ON b.lot_id = l.id
            JOIN campsites c ON l.campsite_id = c.id
            WHERE c.owner_id = :ownerId
            ORDER BY b.created_at DESC LIMIT :limit OFFSET :offset
            """;
        List<BookingModel> content = jdbc.query(sql,
            Map.of("ownerId", ownerId, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadBookingExtras(content);

        String countSql = """
            SELECT COUNT(*) FROM bookings b
            JOIN lots l ON b.lot_id = l.id
            JOIN campsites c ON l.campsite_id = c.id
            WHERE c.owner_id = :ownerId
            """;
        Long total = jdbc.queryForObject(countSql, Map.of("ownerId", ownerId), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public Page<BookingModel> findByOwnerIdAndStatus(UUID ownerId, BookingStatus status, Pageable pageable) {
        String sql = """
            SELECT b.* FROM bookings b
            JOIN lots l ON b.lot_id = l.id
            JOIN campsites c ON l.campsite_id = c.id
            WHERE c.owner_id = :ownerId AND b.status = :status
            ORDER BY b.created_at DESC LIMIT :limit OFFSET :offset
            """;
        List<BookingModel> content = jdbc.query(sql,
            Map.of("ownerId", ownerId, "status", status.name(), "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadBookingExtras(content);

        String countSql = """
            SELECT COUNT(*) FROM bookings b
            JOIN lots l ON b.lot_id = l.id
            JOIN campsites c ON l.campsite_id = c.id
            WHERE c.owner_id = :ownerId AND b.status = :status
            """;
        Long total = jdbc.queryForObject(countSql, Map.of("ownerId", ownerId, "status", status.name()), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public List<BookingModel> findConflictingBookings(UUID lotId, LocalDate checkIn, LocalDate checkOut) {
        String sql = """
            SELECT * FROM bookings
            WHERE lot_id = :lotId AND status != 'CANCELLED'
            AND check_in <= :checkOut AND check_out >= :checkIn
            """;
        List<BookingModel> results = jdbc.query(sql,
            Map.of("lotId", lotId, "checkIn", Date.valueOf(checkIn), "checkOut", Date.valueOf(checkOut)), rowMapper);
        loadBookingExtras(results);
        return results;
    }

    public List<BookingModel> findActiveBookingsForUser(UUID userId) {
        String sql = """
            SELECT * FROM bookings
            WHERE user_id = :userId AND status = 'CONFIRMED'
            AND check_in <= CURRENT_DATE AND check_out >= CURRENT_DATE
            """;
        List<BookingModel> results = jdbc.query(sql, Map.of("userId", userId), rowMapper);
        loadBookingExtras(results);
        return results;
    }

    public Page<BookingModel> findByCampsiteId(UUID campsiteId, Pageable pageable) {
        String sql = """
            SELECT b.* FROM bookings b
            JOIN lots l ON b.lot_id = l.id
            WHERE l.campsite_id = :campsiteId
            ORDER BY b.created_at DESC LIMIT :limit OFFSET :offset
            """;
        List<BookingModel> content = jdbc.query(sql,
            Map.of("campsiteId", campsiteId, "limit", pageable.getPageSize(), "offset", pageable.getOffset()), rowMapper);
        loadBookingExtras(content);

        String countSql = """
            SELECT COUNT(*) FROM bookings b
            JOIN lots l ON b.lot_id = l.id
            WHERE l.campsite_id = :campsiteId
            """;
        Long total = jdbc.queryForObject(countSql, Map.of("campsiteId", campsiteId), Long.class);
        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    public List<BookingModel> findByLotId(UUID lotId) {
        String sql = "SELECT * FROM bookings WHERE lot_id = :lotId ORDER BY check_in";
        List<BookingModel> results = jdbc.query(sql, Map.of("lotId", lotId), rowMapper);
        loadBookingExtras(results);
        return results;
    }

    public List<BookingModel> findBookingsCheckingInOn(LocalDate date) {
        String sql = "SELECT * FROM bookings WHERE check_in = :date AND status = 'CONFIRMED'";
        List<BookingModel> results = jdbc.query(sql, Map.of("date", Date.valueOf(date)), rowMapper);
        loadBookingExtras(results);
        return results;
    }

    public List<BookingModel> findBookingsCheckingOutOn(LocalDate date) {
        String sql = "SELECT * FROM bookings WHERE check_out = :date AND status = 'CONFIRMED'";
        List<BookingModel> results = jdbc.query(sql, Map.of("date", Date.valueOf(date)), rowMapper);
        loadBookingExtras(results);
        return results;
    }

    @Transactional
    public BookingModel save(BookingModel booking) {
        if (booking.getId() == null) {
            return insert(booking);
        } else {
            return update(booking);
        }
    }

    private BookingModel insert(BookingModel booking) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(booking.getId(), booking.getCreatedAt());
        booking.setId(audit.id());
        booking.setCreatedAt(audit.createdAt());
        booking.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status,
                lot_price, extras_price, service_fee, total_price, special_requests, cancellation_reason, created_at, updated_at)
            VALUES (:id, :userId, :lotId, :checkIn, :checkOut, :guests, :status,
                :lotPrice, :extrasPrice, :serviceFee, :totalPrice, :specialRequests, :cancellationReason, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(booking));
        saveBookingExtras(booking);
        return booking;
    }

    private BookingModel update(BookingModel booking) {
        booking.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE bookings SET
                user_id = :userId, lot_id = :lotId, check_in = :checkIn, check_out = :checkOut,
                guests = :guests, status = :status, lot_price = :lotPrice, extras_price = :extrasPrice,
                service_fee = :serviceFee, total_price = :totalPrice, special_requests = :specialRequests,
                cancellation_reason = :cancellationReason, updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(booking));
        saveBookingExtras(booking);
        return booking;
    }

    @Transactional
    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM booking_extras WHERE booking_id = :id", Map.of("id", id));
        jdbc.update("DELETE FROM bookings WHERE id = :id", Map.of("id", id));
    }

    private void loadBookingExtras(List<BookingModel> bookings) {
        if (bookings.isEmpty()) return;

        List<UUID> ids = bookings.stream().map(BookingModel::getId).toList();
        String sql = "SELECT * FROM booking_extras WHERE booking_id IN (:ids)";

        Map<UUID, List<BookingExtraModel>> extrasMap = new HashMap<>();
        jdbc.query(sql, Map.of("ids", ids), rs -> {
            BookingExtraModel extra = bookingExtraRowMapper.mapRow(rs, 0);
            extrasMap.computeIfAbsent(extra.getBookingId(), k -> new ArrayList<>()).add(extra);
        });

        bookings.forEach(b -> b.setBookingExtras(extrasMap.getOrDefault(b.getId(), List.of())));
    }

    @Transactional
    private void saveBookingExtras(BookingModel booking) {
        UUID id = booking.getId();

        // Delete existing (orphan removal)
        jdbc.update("DELETE FROM booking_extras WHERE booking_id = :id", Map.of("id", id));

        if (booking.getBookingExtras() != null && !booking.getBookingExtras().isEmpty()) {
            String sql = """
                INSERT INTO booking_extras (id, booking_id, extra_id, quantity, unit_price, total_price, created_at, updated_at)
                VALUES (:id, :bookingId, :extraId, :quantity, :unitPrice, :totalPrice, :createdAt, :updatedAt)
                """;

            for (BookingExtraModel extra : booking.getBookingExtras()) {
                if (extra.getId() == null) {
                    extra.setId(UUID.randomUUID());
                    extra.setCreatedAt(AuditingUtil.now());
                }
                extra.setBookingId(booking.getId());
                extra.setUpdatedAt(AuditingUtil.now());

                jdbc.update(sql, Map.of(
                    "id", extra.getId(),
                    "bookingId", extra.getBookingId(),
                    "extraId", extra.getExtraId(),
                    "quantity", extra.getQuantity(),
                    "unitPrice", extra.getUnitPrice(),
                    "totalPrice", extra.getTotalPrice(),
                    "createdAt", Timestamp.from(extra.getCreatedAt()),
                    "updatedAt", Timestamp.from(extra.getUpdatedAt())
                ));
            }
        }
    }

    private MapSqlParameterSource toParameterSource(BookingModel booking) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", booking.getId());
        params.addValue("userId", booking.getUserId());
        params.addValue("lotId", booking.getLotId());
        params.addValue("checkIn", Date.valueOf(booking.getCheckIn()));
        params.addValue("checkOut", Date.valueOf(booking.getCheckOut()));
        params.addValue("guests", booking.getGuests());
        params.addValue("status", booking.getStatus() != null ? booking.getStatus().name() : BookingStatus.PENDING.name());
        params.addValue("lotPrice", booking.getLotPrice());
        params.addValue("extrasPrice", booking.getExtrasPrice());
        params.addValue("serviceFee", booking.getServiceFee());
        params.addValue("totalPrice", booking.getTotalPrice());
        params.addValue("specialRequests", booking.getSpecialRequests());
        params.addValue("cancellationReason", booking.getCancellationReason());
        params.addValue("createdAt", Timestamp.from(booking.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(booking.getUpdatedAt()));
        return params;
    }
}
