package com.example.myislandapi.repository.rowmapper;

import com.example.myislandapi.model.CheckInInstructionsModel;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.UUID;

@Component
public class CheckInInstructionsRowMapper implements RowMapper<CheckInInstructionsModel> {

    @Override
    public CheckInInstructionsModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        CheckInInstructionsModel instructions = new CheckInInstructionsModel();
        instructions.setId(UUID.fromString(rs.getString("id")));

        String campsiteId = rs.getString("campsite_id");
        if (campsiteId != null) {
            instructions.setCampsiteId(UUID.fromString(campsiteId));
        }

        instructions.setAccessCode(rs.getString("access_code"));
        instructions.setGateCode(rs.getString("gate_code"));
        instructions.setWifiName(rs.getString("wifi_name"));
        instructions.setWifiPassword(rs.getString("wifi_password"));

        Time checkInTime = rs.getTime("check_in_time");
        if (checkInTime != null) {
            instructions.setCheckInTime(checkInTime.toLocalTime());
        }

        Time checkOutTime = rs.getTime("check_out_time");
        if (checkOutTime != null) {
            instructions.setCheckOutTime(checkOutTime.toLocalTime());
        }

        instructions.setDirections(rs.getString("directions"));
        instructions.setParkingInfo(rs.getString("parking_info"));
        instructions.setHostName(rs.getString("host_name"));
        instructions.setHostPhone(rs.getString("host_phone"));
        instructions.setHostEmail(rs.getString("host_email"));
        instructions.setHostAvatar(rs.getString("host_avatar"));
        instructions.setHostResponseTime(rs.getString("host_response_time"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            instructions.setCreatedAt(createdAt.toInstant());
        }

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            instructions.setUpdatedAt(updatedAt.toInstant());
        }

        return instructions;
    }
}
