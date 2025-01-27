package pl.pas.rest.services.implementations;

import com.mongodb.MongoWriteException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.pas.dto.create.UserCreateDTO;
import pl.pas.dto.update.UserUpdateDTO;
import pl.pas.rest.exceptions.ApplicationBaseException;
import pl.pas.rest.exceptions.user.EmailAlreadyExistException;
import pl.pas.rest.exceptions.user.UserDeactivateException;
import pl.pas.rest.exceptions.user.UserStateChangeException;
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

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@RequiredArgsConstructor
@Service
public class UserService extends ObjectService implements IUserService {

    private final IUserRepository userRepository;
    private final IRentRepository rentRepository;



    @Override
    public Admin createAdmin(UserCreateDTO createDTO) {
        MessageDigest messageDigest;
        try {
            messageDigest = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new ApplicationBaseException(I18n.APPLICATION_NO_SUCH_ALGORITHM_EXCEPTION);
        }
        messageDigest.update(createDTO.password().getBytes());
        String stringHash = new String(messageDigest.digest());
        AdminMgd userMgd = new AdminMgd(
                createDTO.firstName(),
                createDTO.lastName(),
                createDTO.email(),
                stringHash,
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
        MessageDigest messageDigest;
        try {
            messageDigest = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new ApplicationBaseException(I18n.APPLICATION_NO_SUCH_ALGORITHM_EXCEPTION);
        }
        messageDigest.update(createDTO.password().getBytes());
        String stringHash = new String(messageDigest.digest());
        LibrarianMgd librarianMgd = new LibrarianMgd(
                createDTO.firstName(),
                createDTO.lastName(),
                createDTO.email(),
                stringHash,
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
        MessageDigest messageDigest;
        try {
            messageDigest = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new ApplicationBaseException(I18n.APPLICATION_NO_SUCH_ALGORITHM_EXCEPTION);
        }
        messageDigest.update(createDTO.password().getBytes());
        String stringHash = new String(messageDigest.digest());
        ReaderMgd readerMgd = new ReaderMgd(
                createDTO.firstName(),
                createDTO.lastName(),
                createDTO.email(),
                stringHash,
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

    @Override
    public User findById(UUID id) {
        UserMgd user = userRepository.findById(id);
        return new User(user);
    }
    @Override
    public List<User> findByEmail(String email) {
        List<UserMgd> users = userRepository.findByEmail(email);
        return users.stream().map(this::mapUser).toList();
    }

    private User mapUser(UserMgd user) {
            return switch (user) {
                case AdminMgd admin -> new Admin(admin);
                case LibrarianMgd librarian -> new Librarian(librarian);
                case ReaderMgd readerMgd -> new Reader(readerMgd);
                default -> throw new IllegalStateException("Unexpected user class : " + user);
            };
    }

    private User findAnyUserById(UUID id) {
        return mapUser(userRepository.findAnyUserById(id));
    }


    @Override
    public List<User> findAll() {
        return userRepository.findAll().stream().map(this::mapUser).toList();
    }

    @Override
    public User updateUser(UserUpdateDTO updateDTO) {
        findById(updateDTO.id());
        UserMgd modified = UserMgd.builder()
                .id(updateDTO.id())
                .firstName(updateDTO.firstName())
                .lastName(updateDTO.lastName())
                .email(updateDTO.email())
                .cityName(updateDTO.cityName())
                .streetName(updateDTO.streetName())
                .streetNumber(updateDTO.streetNumber())
                .build();
        try {
            userRepository.save(modified);
        } catch (MongoWriteException e) {
            throw new EmailAlreadyExistException();
        }

        return findAnyUserById(updateDTO.id());
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
