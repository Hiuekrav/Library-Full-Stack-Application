package pl.pas.rest.controllers.interfaces;

import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.pas.dto.LoginDTO;

@RequestMapping("api/")
public interface IAuthenticationController {
    @PostMapping(value = "login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<?> login(@RequestBody @Valid LoginDTO loginDTO);
}
