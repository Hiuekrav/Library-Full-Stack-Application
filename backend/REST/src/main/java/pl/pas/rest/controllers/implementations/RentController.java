package pl.pas.rest.controllers.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pas.dto.create.RentCreateDTO;
import pl.pas.dto.create.RentCreateReaderDTO;
import pl.pas.dto.create.RentCreateShortDTO;
import pl.pas.dto.output.RentOutputDTO;
import pl.pas.dto.update.RentUpdateDTO;
import pl.pas.rest.config.security.JwtProvider;
import pl.pas.rest.controllers.interfaces.IRentController;
import pl.pas.rest.exceptions.ApplicationDataIntegrityException;
import pl.pas.rest.exceptions.rent.RentNotFoundException;
import pl.pas.rest.mgd.users.UserMgd;
import pl.pas.rest.model.Rent;
import pl.pas.rest.model.users.User;
import pl.pas.rest.services.implementations.UserService;
import pl.pas.rest.services.interfaces.IRentService;
import pl.pas.rest.utils.mappers.RentMapper;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
public class RentController implements IRentController {

    private final IRentService rentService;

    private final JwtProvider jwtProvider;

    private final String rentCreatedURI = "rents/%s";

    private final UserService userService;

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> createRent(RentCreateDTO rentCreateDTO) {
        Rent rent = rentService.createRent(rentCreateDTO);
        return ResponseEntity.created(URI.create(rentCreatedURI.formatted(rent.getId())))
                .body(RentMapper.toRentOutputDTO(rent));
    }

    @PreAuthorize("hasAnyRole('READER')")
    @Override
    public ResponseEntity<?> createRentByCurrentUser(RentCreateReaderDTO rentCreateDTO) {
        User user = userService.findCurrentUser();
        RentCreateDTO rentCreateDTO1 = new RentCreateDTO(rentCreateDTO.beginTime(), rentCreateDTO.endTime(), user.getId(), rentCreateDTO.bookId());
        return createRent(rentCreateDTO1);
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    @Override
    public ResponseEntity<?> createRentNow(RentCreateShortDTO rentCreateShortDTO) {
        Rent rent = rentService.createRentWithUnspecifiedTime(rentCreateShortDTO);
        return ResponseEntity.created(URI.create(rentCreatedURI.formatted(rent.getId())))
                .body(RentMapper.toRentOutputDTO(rent));
    }

    @PreAuthorize("hasAnyRole('READER')")
    @Override
    public ResponseEntity<?> createRentNowByCurrentUser(UUID bookId) {
        User currentUser = userService.findCurrentUser();
        return createRentNow(new RentCreateShortDTO(currentUser.getId(), bookId));
    }

    // General

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> findAllFuture() {
        List<Rent> rents = rentService.findAllFuture();
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO).toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> findAllActive() {
        List<Rent> rents = rentService.findAllActive();
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO).toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> findAllArchive() {
        List<Rent> rents = rentService.findAllArchive();
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO).toList());
    }

    // By Rent
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> findAllRents() {
        List<Rent> rents = rentService.findAll();
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> findById(UUID id) {
        Rent rent;
        try {
            rent = rentService.findRentById(id);
        } catch (RentNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
        RentOutputDTO rentOutputDTO = RentMapper.toRentOutputDTO(rent);
        String signature = jwtProvider.generateSignature(rentOutputDTO);
        return ResponseEntity.ok().eTag(signature).body(rentOutputDTO);
    }

    // By Reader
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> findAllByReaderId(UUID readerId) {
        List<Rent> rents = rentService.findAllByReaderId(readerId);
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> findAllFutureByReaderId(UUID readerId) {
        List<Rent> rents = rentService.findAllFutureByReaderId(readerId);
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO).toList());
    }

    @PreAuthorize("hasAnyRole('READER')")
    @Override
    public ResponseEntity<?> findAllFutureByCurrentUser() {
        List<Rent> rents = rentService.findAllFutureByCurrentUser();
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO).toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> findAllActiveByReaderId(UUID readerId) {
        List<Rent> rents = rentService.findAllActiveByReaderId(readerId);
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok((rents.stream().map(RentMapper::toRentOutputDTO).toList()));
    }

    @PreAuthorize("hasAnyRole('READER')")
    @Override
    public ResponseEntity<?> findAllActiveByCurrentUser() {
        List<Rent> rents = rentService.findAllActiveByCurrentUser();
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok((rents.stream().map(RentMapper::toRentOutputDTO).toList()));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> findAllArchivedByReaderId(UUID readerId) {
        List<Rent> rents = rentService.findAllArchivedByReaderId(readerId);
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO).toList());
    }

    @PreAuthorize("hasAnyRole('READER')")
    @Override
    public ResponseEntity<?> findAllArchivedByCurrentUser() {
        List<Rent> rents = rentService.findAllArchivedByCurrentUser();
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO).toList());
    }

    // By Book
    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    @Override
    public ResponseEntity<?> findAllByBookId(UUID readerId) {
        List<Rent> rents = rentService.findAllByBookId(readerId);
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO));
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    @Override
    public ResponseEntity<?> findAllFutureByBookId(UUID bookId) {
        List<Rent> rents = rentService.findAllFutureByBookId(bookId);
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO).toList());
    }


    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    @Override
    public ResponseEntity<?> findAllActiveByBookId(UUID bookId) {
        List<Rent> rents = rentService.findAllActiveByBookId(bookId);
        if (rents.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO).toList());
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    @Override
    public ResponseEntity<?> findAllArchivedByBookId(UUID bookId) {
        List<Rent> rents = rentService.findAllArchivedByBookId(bookId);
        if (rents.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(rents.stream().map(RentMapper::toRentOutputDTO).toList());
    }

    @PreAuthorize("hasAnyRole('READER')")
    @Override
    public ResponseEntity<?> updateRent(UUID id, String ifMatch, RentUpdateDTO updateDTO) {

        String signature = jwtProvider.generateSignature(updateDTO);
        if (!ifMatch.equals(signature)) {
            throw new ApplicationDataIntegrityException();
        }

        Rent updatedRent = rentService.updateRent(id, updateDTO);
        RentOutputDTO outputDTO = RentMapper.toRentOutputDTO(updatedRent);
        return ResponseEntity.ok().body(outputDTO);
    }

    @PreAuthorize("hasAnyRole('READER')")
    @Override
    public ResponseEntity<?> endRent(UUID rentId) {
        rentService.endRent(rentId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> deleteRent(UUID id) {
        rentService.deleteRent(id);
        return ResponseEntity.noContent().build();
    }
}
