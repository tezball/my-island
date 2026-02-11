package com.myisland.api.modules.admin.controller;

import com.myisland.api.modules.admin.service.AdminFinancialService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/financial")
public class AdminFinancialController {

    private final AdminFinancialService financialService;

    public AdminFinancialController(AdminFinancialService financialService) {
        this.financialService = financialService;
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<Map<String, Object>>> getRevenue(
            @RequestParam(defaultValue = "monthly") String period) {
        return ResponseEntity.ok(financialService.getRevenue(period));
    }

    @GetMapping("/service-fees")
    public ResponseEntity<List<Map<String, Object>>> getServiceFees(
            @RequestParam(defaultValue = "monthly") String period) {
        return ResponseEntity.ok(financialService.getServiceFees(period));
    }

    @GetMapping("/per-owner")
    public ResponseEntity<List<Map<String, Object>>> getPerOwnerRevenue() {
        return ResponseEntity.ok(financialService.getPerOwnerRevenue());
    }

    @GetMapping("/booking-volume")
    public ResponseEntity<List<Map<String, Object>>> getBookingVolume(
            @RequestParam(defaultValue = "monthly") String period) {
        return ResponseEntity.ok(financialService.getBookingVolume(period));
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportCsv(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        String csv = financialService.exportCsv(startDate, endDate);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "financial-report.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv);
    }
}
