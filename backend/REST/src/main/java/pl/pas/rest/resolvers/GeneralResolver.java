package pl.pas.rest.resolvers;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import pl.pas.dto.output.ExceptionOutputDTO;
import pl.pas.rest.exceptions.ApplicationDataIntegrityException;
import pl.pas.rest.exceptions.ApplicationDatabaseException;

@Order(20)
@ControllerAdvice
public class GeneralResolver {

    @ExceptionHandler(value = {ApplicationDatabaseException.class})
    public ResponseEntity<?> handleDatabaseException(ApplicationDatabaseException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ExceptionOutputDTO(e.getMessage()));
    }

    @ExceptionHandler(value = {ApplicationDataIntegrityException.class})
    public ResponseEntity<?> handleDataIntegrityExceptions(ApplicationDataIntegrityException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionOutputDTO(e.getMessage()));
    }

}
