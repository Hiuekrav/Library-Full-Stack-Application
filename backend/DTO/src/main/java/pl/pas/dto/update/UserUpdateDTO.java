package pl.pas.dto.update;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import pl.pas.dto.SignedDTO;
import pl.pas.dto.ValidationConstants;

import java.util.UUID;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO extends SignedDTO {

        @Size(min = ValidationConstants.FIRST_NAME_MIN_LENGTH, message = ValidationConstants.FIRST_NAME_TOO_SHORT)
        @Size(max = ValidationConstants.FIRST_NAME_MAX_LENGTH, message = ValidationConstants.FIRST_NAME_TOO_LONG)
        private String firstName;

        @Size(min = ValidationConstants.LAST_NAME_MIN_LENGTH, message = ValidationConstants.LAST_NAME_TOO_SHORT)
        @Size(max = ValidationConstants.LAST_NAME_MAX_LENGTH, message = ValidationConstants.LAST_NAME_TOO_LONG)
        private String lastName;

        @Email(message = ValidationConstants.EMAIL_INVALID_FORMAT)
        private String email;

        private String cityName;
        private String streetName;
        private String streetNumber;
}
