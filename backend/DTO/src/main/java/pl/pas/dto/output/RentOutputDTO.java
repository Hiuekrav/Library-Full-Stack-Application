package pl.pas.dto.output;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import pl.pas.dto.SignedDTO;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@Getter @Setter
public class RentOutputDTO extends SignedDTO {
    UserDataOutputDTO userOutputDTO;
    BookDataOutputDTO bookOutputDTO;
    LocalDateTime beginTime;
    LocalDateTime endTim;

    public RentOutputDTO(UUID id, UserDataOutputDTO userOutputDTO,
                         BookDataOutputDTO bookOutputDTO, LocalDateTime beginTime, LocalDateTime endTim) {
        super(id);
        this.userOutputDTO = userOutputDTO;
        this.bookOutputDTO = bookOutputDTO;
        this.beginTime = beginTime;
        this.endTim = endTim;
    }
}
