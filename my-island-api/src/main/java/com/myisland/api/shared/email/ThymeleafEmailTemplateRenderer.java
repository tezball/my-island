package com.myisland.api.shared.email;

import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Component
public class ThymeleafEmailTemplateRenderer implements EmailTemplateRenderer {

    private final TemplateEngine templateEngine;

    public ThymeleafEmailTemplateRenderer(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @Override
    public String render(String templateName, Context context) {
        return templateEngine.process(templateName, context);
    }
}
