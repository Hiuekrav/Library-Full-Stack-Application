package pl.pas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginDTO (
        @NotBlank (message =ValidationConstants.EMAIL_BLANK)
        @Email(message = ValidationConstants.EMAIL_INVALID_FORMAT)
        String email,

        @NotBlank(message = ValidationConstants.PASSWORD_BLANK)
        @Size(min = ValidationConstants.PASSWORD_MIN_LENGTH, message = ValidationConstants.PASSWORD_TOO_SHORT)
        String password
) {}
