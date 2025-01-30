package pl.pas.rest.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configurers.provisioning.UserDetailsManagerConfigurer;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.pas.rest.exceptions.user.UserBaseException;
import pl.pas.rest.exceptions.user.UserNotFoundException;
import pl.pas.rest.mgd.users.UserMgd;
import pl.pas.rest.model.users.User;
import pl.pas.rest.repositories.implementations.UserRepository;
import pl.pas.rest.services.implementations.UserService;
import pl.pas.rest.utils.consts.I18n;
import pl.pas.rest.utils.mappers.UserMapper;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CustomUserDetails implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserMgd user;
        try {
            user = userRepository.findByEmail(username);
        } catch (UserNotFoundException e) {
            throw new UserBaseException(I18n.INVALID_EMAIL_OR_PASSWORD);
        }
        User foundUser = UserMapper.mapUser(user);
        return org.springframework.security.core.userdetails.User.builder()
                .username(foundUser.getEmail())
                .password(foundUser.getPassword())
                .accountLocked(!foundUser.isActive())
                .roles(UserMapper.getUserRole(foundUser).toUpperCase())
                .build();
    }
}
