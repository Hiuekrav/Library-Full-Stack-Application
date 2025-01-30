package pl.pas.dto.output;

import lombok.*;
import lombok.experimental.SuperBuilder;
import pl.pas.dto.SignedDTO;

import java.util.UUID;

@Getter @Setter
public class UserDetailsOutputDTO extends SignedDTO {
    String firstName;
    String lastName;
    String email;
    String cityName;
    String streetName;
    String streetNumber;
    String role;
    boolean active;

    public UserDetailsOutputDTO(UUID id, String firstName, String lastName, String email, String cityName,
                                String streetName, String streetNumber, String role, boolean active) {
        super(id);
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.cityName = cityName;
        this.streetName = streetName;
        this.streetNumber = streetNumber;
        this.role = role;
        this.active = active;
    }
}
