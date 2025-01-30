package pl.pas.dto.update;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.pas.dto.SignedDTO;
import pl.pas.dto.ValidationConstants;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@Getter @Setter
@NoArgsConstructor
public class RentUpdateDTO extends SignedDTO {
        LocalDateTime endTime;
}
