package pl.pas.rest.controllers.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import pl.pas.dto.LoginDTO;
import pl.pas.dto.output.TokenOutputDTO;
import pl.pas.rest.controllers.interfaces.IAuthenticationController;
import pl.pas.rest.exceptions.user.UserBaseException;
import pl.pas.rest.exceptions.user.UserNotFoundException;
import pl.pas.rest.services.implementations.UserService;
import pl.pas.rest.utils.consts.I18n;

@RestController
@RequiredArgsConstructor
public class AuthenticationController implements IAuthenticationController {

    private final UserService userService;

    @Override
    public ResponseEntity<?> login(LoginDTO loginDTO) {
        String token;
        try {
            token = userService.login(loginDTO.email(), loginDTO.password());
        }
        catch (UserNotFoundException e) {
            throw new UserBaseException(I18n.INVALID_EMAIL_OR_PASSWORD);
        }
        return ResponseEntity.ok(new TokenOutputDTO(token));
    }
}
