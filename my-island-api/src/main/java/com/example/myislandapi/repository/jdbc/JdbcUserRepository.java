package com.example.myislandapi.repository.jdbc;

import com.example.myislandapi.model.LinkedAccountModel;
import com.example.myislandapi.model.NotificationPreferences;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.repository.rowmapper.UserRowMapper;
import com.example.myislandapi.util.AuditingUtil;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;

@Repository
public class JdbcUserRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final UserRowMapper rowMapper;

    public JdbcUserRepository(NamedParameterJdbcTemplate jdbc, UserRowMapper rowMapper) {
        this.jdbc = jdbc;
        this.rowMapper = rowMapper;
    }

    public Optional<UserModel> findById(UUID id) {
        String sql = "SELECT * FROM users WHERE id = :id";
        List<UserModel> results = jdbc.query(sql, Map.of("id", id), rowMapper);
        if (!results.isEmpty()) {
            loadLinkedAccounts(results);
        }
        return results.stream().findFirst();
    }

    public Optional<UserModel> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = :email";
        List<UserModel> results = jdbc.query(sql, Map.of("email", email), rowMapper);
        if (!results.isEmpty()) {
            loadLinkedAccounts(results);
        }
        return results.stream().findFirst();
    }

    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = :email";
        Integer count = jdbc.queryForObject(sql, Map.of("email", email), Integer.class);
        return count != null && count > 0;
    }

    public boolean existsById(UUID id) {
        String sql = "SELECT COUNT(*) FROM users WHERE id = :id";
        Integer count = jdbc.queryForObject(sql, Map.of("id", id), Integer.class);
        return count != null && count > 0;
    }

    public List<UserModel> findAll() {
        String sql = "SELECT * FROM users ORDER BY created_at DESC";
        List<UserModel> users = jdbc.query(sql, rowMapper);
        loadLinkedAccounts(users);
        return users;
    }

    @Transactional
    public UserModel save(UserModel user) {
        if (user.getId() == null) {
            return insert(user);
        } else {
            return update(user);
        }
    }

    private UserModel insert(UserModel user) {
        AuditingUtil.AuditFields audit = AuditingUtil.prepareForInsert(user.getId(), user.getCreatedAt());
        user.setId(audit.id());
        user.setCreatedAt(audit.createdAt());
        user.setUpdatedAt(audit.updatedAt());

        String sql = """
            INSERT INTO users (id, email, password_hash, name, avatar, phone, bio,
                is_owner, is_supplier, email_notifications, push_notifications,
                sms_notifications, marketing_notifications, created_at, updated_at)
            VALUES (:id, :email, :passwordHash, :name, :avatar, :phone, :bio,
                :isOwner, :isSupplier, :emailNotifications, :pushNotifications,
                :smsNotifications, :marketingNotifications, :createdAt, :updatedAt)
            """;

        jdbc.update(sql, toParameterSource(user));
        saveLinkedAccounts(user);
        return user;
    }

    private UserModel update(UserModel user) {
        user.setUpdatedAt(AuditingUtil.prepareForUpdate());

        String sql = """
            UPDATE users SET
                email = :email, password_hash = :passwordHash, name = :name, avatar = :avatar,
                phone = :phone, bio = :bio, is_owner = :isOwner, is_supplier = :isSupplier,
                email_notifications = :emailNotifications, push_notifications = :pushNotifications,
                sms_notifications = :smsNotifications, marketing_notifications = :marketingNotifications,
                updated_at = :updatedAt
            WHERE id = :id
            """;

        jdbc.update(sql, toParameterSource(user));
        saveLinkedAccounts(user);
        return user;
    }

    @Transactional
    public void deleteById(UUID id) {
        // Delete linked accounts first (manual cascade)
        jdbc.update("DELETE FROM linked_accounts WHERE user_id = :userId", Map.of("userId", id));
        jdbc.update("DELETE FROM users WHERE id = :id", Map.of("id", id));
    }

    public long count() {
        String sql = "SELECT COUNT(*) FROM users";
        Long count = jdbc.queryForObject(sql, Map.of(), Long.class);
        return count != null ? count : 0L;
    }

    private void loadLinkedAccounts(List<UserModel> users) {
        if (users.isEmpty()) return;

        List<UUID> userIds = users.stream().map(UserModel::getId).toList();
        String sql = """
            SELECT la.*, la.id as id, la.user_id as user_id, la.provider as provider,
                   la.email as email, la.connected as connected,
                   la.created_at as created_at, la.updated_at as updated_at
            FROM linked_accounts la WHERE la.user_id IN (:userIds)
            """;

        Map<UUID, List<LinkedAccountModel>> accountsMap = new HashMap<>();
        jdbc.query(sql, Map.of("userIds", userIds), rs -> {
            LinkedAccountModel account = new LinkedAccountModel();
            account.setId(UUID.fromString(rs.getString("id")));
            account.setUserId(UUID.fromString(rs.getString("user_id")));
            account.setProvider(com.example.myislandapi.enums.SocialProvider.valueOf(rs.getString("provider")));
            account.setEmail(rs.getString("email"));
            account.setConnected(rs.getBoolean("connected"));
            if (rs.getTimestamp("created_at") != null) {
                account.setCreatedAt(rs.getTimestamp("created_at").toInstant());
            }
            if (rs.getTimestamp("updated_at") != null) {
                account.setUpdatedAt(rs.getTimestamp("updated_at").toInstant());
            }

            accountsMap.computeIfAbsent(account.getUserId(), k -> new ArrayList<>()).add(account);
        });

        users.forEach(user -> user.setLinkedAccounts(accountsMap.getOrDefault(user.getId(), List.of())));
    }

    @Transactional
    private void saveLinkedAccounts(UserModel user) {
        // Delete existing and re-insert (orphan removal pattern)
        jdbc.update("DELETE FROM linked_accounts WHERE user_id = :userId", Map.of("userId", user.getId()));

        if (user.getLinkedAccounts() != null && !user.getLinkedAccounts().isEmpty()) {
            String sql = """
                INSERT INTO linked_accounts (id, user_id, provider, email, connected, created_at, updated_at)
                VALUES (:id, :userId, :provider, :email, :connected, :createdAt, :updatedAt)
                """;

            for (LinkedAccountModel account : user.getLinkedAccounts()) {
                if (account.getId() == null) {
                    account.setId(UUID.randomUUID());
                    account.setCreatedAt(AuditingUtil.now());
                }
                account.setUserId(user.getId());
                account.setUpdatedAt(AuditingUtil.now());

                jdbc.update(sql, Map.of(
                    "id", account.getId(),
                    "userId", account.getUserId(),
                    "provider", account.getProvider().name(),
                    "email", account.getEmail(),
                    "connected", account.isConnected(),
                    "createdAt", Timestamp.from(account.getCreatedAt()),
                    "updatedAt", Timestamp.from(account.getUpdatedAt())
                ));
            }
        }
    }

    private MapSqlParameterSource toParameterSource(UserModel user) {
        NotificationPreferences prefs = user.getNotificationPreferences();
        if (prefs == null) {
            prefs = new NotificationPreferences();
        }

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", user.getId());
        params.addValue("email", user.getEmail());
        params.addValue("passwordHash", user.getPasswordHash());
        params.addValue("name", user.getName());
        params.addValue("avatar", user.getAvatar());
        params.addValue("phone", user.getPhone());
        params.addValue("bio", user.getBio());
        params.addValue("isOwner", user.isOwner());
        params.addValue("isSupplier", user.isSupplier());
        params.addValue("emailNotifications", prefs.isEmail());
        params.addValue("pushNotifications", prefs.isPush());
        params.addValue("smsNotifications", prefs.isSms());
        params.addValue("marketingNotifications", prefs.isMarketing());
        params.addValue("createdAt", Timestamp.from(user.getCreatedAt()));
        params.addValue("updatedAt", Timestamp.from(user.getUpdatedAt()));
        return params;
    }
}
