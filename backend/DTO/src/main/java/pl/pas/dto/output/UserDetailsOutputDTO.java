package pl.pas.dto.output;

import java.util.UUID;

public record UserDetailsOutputDTO(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String cityName,
        String streetName,
        String streetNumber,
        String role,
        boolean active
){}
