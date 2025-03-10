package pl.pas.rest.repositories.interfaces;

import pl.pas.rest.mgd.users.UserMgd;

import java.util.List;
import java.util.UUID;

public interface IUserRepository extends IObjectRepository<UserMgd> {

    UserMgd findById(UUID id);

    UserMgd findCurrentUser();

    UserMgd findAnyUserById(UUID id);

    List<UserMgd> findAllByEmail(String email);

    UserMgd findByEmail(String email);

    void deleteAll();
}
