package island.catalog.api;

import island.catalog.api.dto.ErrorBody;
import island.catalog.place.BadRequestException;
import island.catalog.place.DuplicateSlugException;
import island.catalog.place.PlaceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(PlaceNotFoundException.class)
  ResponseEntity<ErrorBody> notFound(PlaceNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorBody(ex.getMessage()));
  }

  @ExceptionHandler(DuplicateSlugException.class)
  ResponseEntity<ErrorBody> conflict(DuplicateSlugException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorBody(ex.getMessage()));
  }

  @ExceptionHandler(BadRequestException.class)
  ResponseEntity<ErrorBody> badRequest(BadRequestException ex) {
    return ResponseEntity.badRequest().body(new ErrorBody(ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ErrorBody> invalid(MethodArgumentNotValidException ex) {
    String message =
        ex.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(err -> err.getField() + " " + err.getDefaultMessage())
            .orElse("Invalid request");
    return ResponseEntity.badRequest().body(new ErrorBody(message));
  }
}
