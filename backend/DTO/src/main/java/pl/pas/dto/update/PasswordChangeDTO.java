package pl.pas.dto.update;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import pl.pas.dto.ValidationConstants;

public record PasswordChangeDTO (
        @NotNull(message = ValidationConstants.OLD_PASSWORD_BLANK)
        @Size(min = ValidationConstants.PASSWORD_MIN_LENGTH, message = ValidationConstants.PASSWORD_TOO_SHORT)
        String oldPassword,
        @NotNull(message = ValidationConstants.NEW_PASSWORD_BLANK)
        @Size(min = ValidationConstants.PASSWORD_MIN_LENGTH, message = ValidationConstants.PASSWORD_TOO_SHORT)
        String newPassword
) {}
