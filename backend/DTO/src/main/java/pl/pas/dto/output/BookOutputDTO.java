package pl.pas.dto.output;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.pas.dto.SignedDTO;

import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class BookOutputDTO extends SignedDTO {
    String title;
    String author;
    Integer numberOfPages;
    String genre;
    LocalDate publishedDate;
    boolean archive;
    boolean rented;

    public BookOutputDTO(UUID id, String title, String author, Integer numberOfPages, String genre, LocalDate publishedDate, boolean archive, boolean rented) {
        super(id);
        this.title = title;
        this.author = author;
        this.numberOfPages = numberOfPages;
        this.genre = genre;
        this.publishedDate = publishedDate;
        this.archive = archive;
        this.rented = rented;
    }
}
