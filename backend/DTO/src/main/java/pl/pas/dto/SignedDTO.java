package pl.pas.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Getter
@NoArgsConstructor
public class SignedDTO {

    @NotNull(message = ValidationConstants.ID_BLANK)
    private UUID id;

    public SignedDTO(UUID id) {
        this.id = id;
    }

    public Map<String, String> signedFields() {
        Map<String, String> signInFields = new HashMap<>();
        signInFields.put("id", id.toString());
        return signInFields;
    }
}
