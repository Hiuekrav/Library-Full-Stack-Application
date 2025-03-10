package pl.pas.rest.resolvers;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import pl.pas.dto.output.ExceptionOutputDTO;
import pl.pas.rest.exceptions.user.*;

@Order(2)
@ControllerAdvice
public class UserExceptionResolver {

    @ExceptionHandler(value = {UserNotFoundException.class,
            UserDeactivateException.class, UserNotActiveException.class, UserBaseException.class})
    public ResponseEntity<?> handleUserDeactivateException(UserBaseException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionOutputDTO(e.getMessage()));
    }

    @ExceptionHandler(value = {EmailAlreadyExistException.class, UserStateChangeException.class})
    public ResponseEntity<?> handleConflictException(UserBaseException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionOutputDTO(e.getMessage()));
    }
}
