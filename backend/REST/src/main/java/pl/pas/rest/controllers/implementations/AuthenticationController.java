package pl.pas.rest.controllers.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;
import pl.pas.dto.LoginDTO;
import pl.pas.rest.controllers.interfaces.IAuthenticationController;
import pl.pas.rest.services.implementations.UserService;

@RestController
@RequiredArgsConstructor
public class AuthenticationController implements IAuthenticationController {

    private final UserService userService;

    @PreAuthorize("isAnonymous()")
    @Override
    public ResponseEntity<?> login(LoginDTO loginDTO) {
        String token = userService.login(loginDTO.email(), loginDTO.password());
        return ResponseEntity.ok(token);
    }
}
