package com.myisland.api.modules.identity.controller;

import com.myisland.api.modules.identity.dto.AddStaffRequest;
import com.myisland.api.modules.identity.dto.StaffMemberDto;
import com.myisland.api.modules.identity.service.StaffService;
import com.myisland.api.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/supplier/staff")
@Tag(name = "Supplier Staff", description = "Manage staff members for supplier accounts")
public class SupplierStaffController {

    private final StaffService staffService;

    public SupplierStaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    @Operation(summary = "List staff members")
    public ResponseEntity<List<StaffMemberDto>> listStaff(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(staffService.listStaffForSupplier(userDetails.getUserId()));
    }

    @PostMapping
    @Operation(summary = "Add a staff member by email")
    public ResponseEntity<StaffMemberDto> addStaff(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody AddStaffRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(staffService.addStaffForSupplier(userDetails.getUserId(), request.email()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove a staff member")
    public ResponseEntity<Void> removeStaff(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        staffService.removeStaffForSupplier(userDetails.getUserId(), id);
        return ResponseEntity.noContent().build();
    }
}
