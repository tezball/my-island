package island.catalog.stay;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({StayProperties.class, AdminProperties.class})
public class StayConfig {}
