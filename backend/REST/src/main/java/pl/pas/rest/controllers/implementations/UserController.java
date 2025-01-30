package pl.pas.rest.controllers.implementations;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pl.pas.dto.create.UserCreateDTO;
import pl.pas.dto.output.UserDetailsOutputDTO;
import pl.pas.dto.update.PasswordChangeDTO;
import pl.pas.dto.update.UserUpdateDTO;
import pl.pas.rest.config.security.JwtProvider;
import pl.pas.rest.controllers.interfaces.IUserController;
import pl.pas.rest.exceptions.ApplicationDataIntegrityException;
import pl.pas.rest.model.users.User;
import pl.pas.rest.services.interfaces.IUserService;
import pl.pas.rest.utils.consts.GeneralConstants;
import pl.pas.rest.utils.consts.I18n;
import pl.pas.rest.utils.mappers.UserMapper;

import java.net.URI;
import java.util.List;
import java.util.UUID;


@RequiredArgsConstructor
@RestController
public class UserController implements IUserController {

    private final IUserService userService;

    private final String userCreateURL = GeneralConstants.APPLICATION_CONTEXT + "/users/%s";

    private final JwtProvider jwtProvider;

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> createAdmin(UserCreateDTO userCreateDTO) {
        User createdUser = userService.createAdmin(userCreateDTO);
        UserDetailsOutputDTO outputDTO = UserMapper.toUserDetailsOutputDTO(createdUser);
        return ResponseEntity.created(URI.create(userCreateURL.formatted(createdUser.getId()))).body(outputDTO);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> createLibrarian(UserCreateDTO userCreateDTO) {
        User createdUser = userService.createLibrarian(userCreateDTO);
        UserDetailsOutputDTO outputDTO = UserMapper.toUserDetailsOutputDTO(createdUser);
        return ResponseEntity.created(URI.create(userCreateURL.formatted(createdUser.getId()))).body(outputDTO);
    }

    @Override
    public ResponseEntity<?> createReader(UserCreateDTO userCreateDTO) {
        User createdUser = userService.createReader(userCreateDTO);
        UserDetailsOutputDTO outputDTO = UserMapper.toUserDetailsOutputDTO(createdUser);
        return ResponseEntity.created(URI.create(userCreateURL.formatted(createdUser.getId()))).body(outputDTO);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> findById(UUID id) {
        User user = userService.findById(id);
        UserDetailsOutputDTO outputDTO = UserMapper.toUserDetailsOutputDTO(user);
        String signature = jwtProvider.generateSignature(outputDTO);
        return ResponseEntity.ok().eTag(signature).body(outputDTO);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    @Override
    public ResponseEntity<?> findByEmail(String email) {
        List<User> user = userService.findAllByEmail(email);
        List<UserDetailsOutputDTO> outputDTOList = user.stream().map(UserMapper::toUserDetailsOutputDTO).toList();
        if (outputDTOList.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok().body(outputDTOList);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> findAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(auth.getName());
        List<User> users = userService.findAll();
        if(users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok().body(users.stream().map(UserMapper::toUserDetailsOutputDTO).toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> updateUser(UUID id, String ifMatch, UserUpdateDTO userUpdateDTO) {

        System.out.println("If-Match: " +ifMatch);
        String signature = jwtProvider.generateSignature(userUpdateDTO);
        if (!signature.equals(ifMatch)) {
            throw new ApplicationDataIntegrityException();
        }
        User updatedUser = userService.updateUser(userUpdateDTO);
        UserDetailsOutputDTO outputDTO = UserMapper.toUserDetailsOutputDTO(updatedUser);
        return ResponseEntity.ok().body(outputDTO);
    }

    @PreAuthorize("isAuthenticated()")
    @Override
    public ResponseEntity<?> changeOwnPassword(PasswordChangeDTO passwordChangeDTO) {
        userService.changePassword(passwordChangeDTO.oldPassword(), passwordChangeDTO.newPassword());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> activateUser(UUID id) {
        userService.activateUser(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @Override
    public ResponseEntity<?> deactivateUser(UUID id) {
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }
}
