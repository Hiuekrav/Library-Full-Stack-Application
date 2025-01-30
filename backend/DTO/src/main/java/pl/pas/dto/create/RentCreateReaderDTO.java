package pl.pas.dto.create;

import jakarta.validation.constraints.NotNull;
import pl.pas.dto.ValidationConstants;

import java.time.LocalDateTime;
import java.util.UUID;

public record RentCreateReaderDTO(
        @NotNull(message = "Begin time null")
        LocalDateTime beginTime,
        @NotNull(message = "End time null")
        LocalDateTime endTime,

        @NotNull(message = ValidationConstants.BOOK_ID_BLANK)
        UUID bookId
) {
}
