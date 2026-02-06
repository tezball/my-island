package com.myisland.api.shared.email;

import org.thymeleaf.context.Context;

public interface EmailTemplateRenderer {
    String render(String templateName, Context context);
}
