package pl.pas.rest.controllers.implementations;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pas.dto.create.BookCreateDTO;
import pl.pas.dto.output.BookOutputDTO;
import pl.pas.dto.update.BookUpdateDTO;
import pl.pas.rest.config.security.JwtProvider;
import pl.pas.rest.controllers.interfaces.IBookController;
import pl.pas.rest.exceptions.ApplicationDataIntegrityException;
import pl.pas.rest.exceptions.ApplicationDatabaseException;
import pl.pas.rest.exceptions.book.BookNotFoundException;
import pl.pas.rest.model.Book;
import pl.pas.rest.services.interfaces.IBookService;
import pl.pas.rest.utils.mappers.BookMapper;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
public class BookController implements IBookController {

    private final IBookService bookService;
    private final JwtProvider jwtProvider;

    private String bookURI = "/books/%s";

    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    @Override
    public ResponseEntity<?> createBook(BookCreateDTO bookCreateDTO) {
        Book book = bookService.createBook(bookCreateDTO);
        BookOutputDTO outputDTO = BookMapper.toBookOutputDTO(book);
        return ResponseEntity.created(URI.create(bookURI.formatted(outputDTO.getId()))).body(outputDTO);
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN', 'READER')")
    @Override
    public ResponseEntity<?> findById(UUID id) {
        Book book;
        try {
            book = bookService.findBookById(id);
        }
        catch (BookNotFoundException e) {
            return ResponseEntity.notFound().build();
        }

        BookOutputDTO outputDTO = BookMapper.toBookOutputDTO(book);
        String signature = jwtProvider.generateSignature(outputDTO);
        return ResponseEntity.ok().eTag(signature).body(outputDTO);
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN', 'READER')")
    @Override
    public ResponseEntity<?> findByTitle(String title) {
        List<Book> foundBooks = bookService.findBookByTitle(title);
        if (foundBooks.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok().body(foundBooks.stream().map(BookMapper::toBookOutputDTO));
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN', 'READER')")
    @Override
    public ResponseEntity<?> findAll() {
        List<Book> foundBooks = bookService.findAll();
        if (foundBooks.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok().body(foundBooks.stream().map(BookMapper::toBookOutputDTO));
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    @Override
    public ResponseEntity<?> updateBook(UUID id, String ifMatch, BookUpdateDTO bookUpdateDTO) {
        String signature = jwtProvider.generateSignature(bookUpdateDTO);

        if (!ifMatch.equals(signature)) {
            throw new ApplicationDataIntegrityException();
        }

        Book updatedBook = bookService.updateBook(id, bookUpdateDTO);
        BookOutputDTO outputDTO = BookMapper.toBookOutputDTO(updatedBook);
        return ResponseEntity.ok().body(outputDTO);
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    @Override
    public ResponseEntity<?> archiveBook(UUID id) {
        bookService.changeArchiveStatus(id, true);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    @Override
    public ResponseEntity<?> activateBook(UUID id) {
        bookService.changeArchiveStatus(id, false);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    @Override
    public ResponseEntity<?> deleteBook(UUID id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
