package pl.pas.rest.services.implementations;

import com.mongodb.MongoWriteException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.pas.dto.create.UserCreateDTO;
import pl.pas.dto.update.UserUpdateDTO;
import pl.pas.rest.config.security.JwtProvider;
import pl.pas.rest.exceptions.user.*;
import pl.pas.rest.mgd.RentMgd;
import pl.pas.rest.mgd.users.AdminMgd;
import pl.pas.rest.mgd.users.LibrarianMgd;
import pl.pas.rest.mgd.users.ReaderMgd;
import pl.pas.rest.mgd.users.UserMgd;
import pl.pas.rest.model.users.Admin;
import pl.pas.rest.model.users.Librarian;
import pl.pas.rest.model.users.Reader;
import pl.pas.rest.model.users.User;
import pl.pas.rest.repositories.interfaces.IRentRepository;
import pl.pas.rest.repositories.interfaces.IUserRepository;
import pl.pas.rest.services.interfaces.IUserService;
import pl.pas.rest.utils.consts.I18n;
import pl.pas.rest.utils.mappers.UserMapper;

import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;


@RequiredArgsConstructor
@Service
public class UserService extends ObjectService implements IUserService {

    private final IUserRepository userRepository;
    private final IRentRepository rentRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;


    @Override
    public Admin createAdmin(UserCreateDTO createDTO) {
        AdminMgd userMgd = new AdminMgd(
                createDTO.firstName(),
                createDTO.lastName(),
                createDTO.email(),
                passwordEncoder.encode(createDTO.password()),
                createDTO.cityName(),
                createDTO.streetName(),
                createDTO.streetNumber()
        );
        UserMgd createdUser;
        try {
            createdUser = userRepository.save(userMgd);
        }catch (MongoWriteException e) {
            throw new EmailAlreadyExistException();
        }
        return new Admin(createdUser);
    }

    @Override
    public User createLibrarian(UserCreateDTO createDTO) {
        LibrarianMgd librarianMgd = new LibrarianMgd(
                createDTO.firstName(),
                createDTO.lastName(),
                createDTO.email(),
                passwordEncoder.encode(createDTO.password()),
                createDTO.cityName(),
                createDTO.streetName(),
                createDTO.streetNumber()
        );

        UserMgd createdUser;
        try {
            createdUser = userRepository.save(librarianMgd);
        }catch (MongoWriteException e) {
            throw new EmailAlreadyExistException();
        }
        return new Librarian(createdUser);
    }

    @Override
    public Reader createReader(UserCreateDTO createDTO) {
        ReaderMgd readerMgd = new ReaderMgd(
                createDTO.firstName(),
                createDTO.lastName(),
                createDTO.email(),
                passwordEncoder.encode(createDTO.password()),
                createDTO.cityName(),
                createDTO.streetName(),
                createDTO.streetNumber()
        );

        UserMgd createdUser;
        try {
            createdUser = userRepository.save(readerMgd);
        }catch (MongoWriteException e) {
            throw new EmailAlreadyExistException();
        }
        return new Reader(createdUser);
    }

    public String login(String email, String password) {
       UserMgd userMgd = userRepository.findByEmail(email);
       if (!passwordEncoder.matches(password, userMgd.getPassword())) {
           throw new UserNotFoundException();
       }
       return jwtProvider.generateToken(UserMapper.mapUser(userMgd));
    }

    @Override
    public User findById(UUID id) {
        UserMgd user = userRepository.findById(id);
        return UserMapper.mapUser(user);
    }
    @Override
    public List<User> findAllByEmail(String email) {
        List<UserMgd> users = userRepository.findAllByEmail(email);
        return users.stream().map(UserMapper::mapUser).toList();
    }


    private User findAnyUserById(UUID id) {
        return UserMapper.mapUser(userRepository.findAnyUserById(id));
    }


    @Override
    public List<User> findAll() {
        return userRepository.findAll().stream().map(UserMapper::mapUser).toList();
    }

    @Override
    public User updateUser(UserUpdateDTO updateDTO) {


        findById(updateDTO.getId());
        UserMgd modified = UserMgd.builder()
                .id(updateDTO.getId())
                .firstName(updateDTO.getFirstName())
                .lastName(updateDTO.getLastName())
                .email(updateDTO.getEmail())
                .cityName(updateDTO.getCityName())
                .streetName(updateDTO.getStreetName())
                .streetNumber(updateDTO.getStreetNumber())
                .build();
        try {
            userRepository.save(modified);
        } catch (MongoWriteException e) {
            throw new EmailAlreadyExistException();
        }

        return findAnyUserById(updateDTO.getId());
    }


    @Override
    public void changePassword(String oldPassword, String newPassword) {
        UserMgd currentUser = userRepository.findCurrentUser();
        if (!passwordEncoder.matches(oldPassword, currentUser.getPassword())) {
            throw new UserBaseException(I18n.INVALID_OLD_PASSWORD);
        }
        currentUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(currentUser);
    }

    @Override
    public void deactivateUser(UUID id) {
        UserMgd user = userRepository.findById(id);
        List<RentMgd> activeRents = Stream.concat(rentRepository.findAllActiveByReaderId(id).stream(),
                                                  rentRepository.findAllFutureByReaderId(id).stream()).toList();
        if (!activeRents.isEmpty()) {
            throw new UserDeactivateException(I18n.USER_HAS_ACTIVE_OR_FUTURE_RENTS_EXCEPTION);
        }
        if (!user.getActive()) {
            throw new UserStateChangeException(I18n.USER_ALREADY_INACTIVE_EXCEPTION);

        }
        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    public void activateUser(UUID id) {
        UserMgd user = userRepository.findById(id);
        if(!user.getActive()) {
            user.setActive(true);
            userRepository.save(user);
        }
        else {
            throw new UserStateChangeException(I18n.USER_ALREADY_ACTIVE_EXCEPTION);
        }
    }

    @Override
    public void deleteAll() {
        userRepository.deleteAll();
    }
}
