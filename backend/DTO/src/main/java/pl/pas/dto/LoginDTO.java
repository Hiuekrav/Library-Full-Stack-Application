package pl.pas.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO (
        @NotBlank (message =ValidationConstants.LOGIN_EMAIL_BLANK)
        String email,
        @NotBlank(message =ValidationConstants.LOGIN_PASSWORD_BLANK)
        String password
) {}
