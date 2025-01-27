package pl.pas.dto.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import pl.pas.dto.ValidationConstants;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Builder
public record RentCreateDTO (
        LocalDateTime beginTime,
        LocalDateTime endTime,

        @NotNull(message = ValidationConstants.READER_ID_BLANK)
        UUID readerId,

        @NotNull(message = ValidationConstants.BOOK_ID_BLANK)
        UUID bookId
) {}
