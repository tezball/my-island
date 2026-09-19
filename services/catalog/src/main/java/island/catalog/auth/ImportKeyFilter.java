package island.catalog.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class ImportKeyFilter extends OncePerRequestFilter {

  public static final String HEADER = "X-Catalog-Import-Key";

  private final CatalogImportProperties importProps;

  public ImportKeyFilter(CatalogImportProperties importProps) {
    this.importProps = importProps;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String path = request.getServletPath();
    if (!StringUtils.hasText(path)) {
      path = request.getRequestURI();
    }
    if ("POST".equalsIgnoreCase(request.getMethod()) && "/api/v1/places".equals(path)) {
      String expected = importProps.key();
      String given = request.getHeader(HEADER);
      if (StringUtils.hasText(expected) && expected.equals(given)) {
        UsernamePasswordAuthenticationToken auth =
            new UsernamePasswordAuthenticationToken(
                "catalog-import",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_IMPORT")));
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    }
    filterChain.doFilter(request, response);
  }
}
