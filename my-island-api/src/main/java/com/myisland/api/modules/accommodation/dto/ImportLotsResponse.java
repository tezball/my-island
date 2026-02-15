package com.myisland.api.modules.accommodation.dto;

import java.util.List;

public record ImportLotsResponse(
        int created,
        int skipped,
        List<String> errors,
        List<String> warnings
) {}
