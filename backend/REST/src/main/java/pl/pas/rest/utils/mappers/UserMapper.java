package pl.pas.rest.utils.mappers;

import pl.pas.dto.output.UserDataOutputDTO;
import pl.pas.dto.output.UserDetailsOutputDTO;
import pl.pas.rest.mgd.users.AdminMgd;
import pl.pas.rest.mgd.users.LibrarianMgd;
import pl.pas.rest.mgd.users.ReaderMgd;
import pl.pas.rest.mgd.users.UserMgd;
import pl.pas.rest.model.users.Admin;
import pl.pas.rest.model.users.Librarian;
import pl.pas.rest.model.users.Reader;
import pl.pas.rest.model.users.User;
import pl.pas.rest.utils.consts.DatabaseConstants;

public class UserMapper {

    public static UserDetailsOutputDTO toUserDetailsOutputDTO(User user) {
        return new UserDetailsOutputDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getCityName(),
                user.getStreetName(),
                user.getStreetNumber(),
                getUserRole(user),
                user.isActive()
        );
    }

    public static UserDataOutputDTO toUserDataOutputDTO(User user) {
        return new UserDataOutputDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );
    }


    public static String getUserRole(User user) {
        return switch (user) {
            case Admin admin  -> DatabaseConstants.ADMIN_DISCRIMINATOR;
            case Librarian librarian  -> DatabaseConstants.LIBRARIAN_DISCRIMINATOR;
            case Reader reader  -> DatabaseConstants.READER_DISCRIMINATOR;
            default -> throw new IllegalStateException("Unexpected value: " + user);
        };
    }

    public static User mapUser(UserMgd user) {
        return switch (user) {
            case AdminMgd admin -> new Admin(admin);
            case LibrarianMgd librarian -> new Librarian(librarian);
            case ReaderMgd readerMgd -> new Reader(readerMgd);
            default -> throw new IllegalStateException("Unexpected user class : " + user);
        };
    }
}
