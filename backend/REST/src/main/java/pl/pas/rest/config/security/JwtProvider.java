package pl.pas.rest.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pl.pas.rest.model.users.User;
import pl.pas.rest.utils.consts.GeneralConstants;
import pl.pas.rest.utils.mappers.UserMapper;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtProvider {

    @Value("${secret.key}")
    private String secret;

    public String generateToken(User user) {
        return JWT.create()
                .withSubject(user.getEmail())
                .withClaim(GeneralConstants.JWT_ROLE, UserMapper.getUserRole(user).toUpperCase())
                .withIssuedAt(Instant.now())
                .withExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                .withIssuer("Library")
                .sign(Algorithm.HMAC256(secret));
    }

    public String extractEmail(String token) {
        DecodedJWT jwt = JWT.decode(token);
        return jwt.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            JWT.require(Algorithm.HMAC256(getSecret()))
                    .build()
                    .verify(token);
        } catch (JWTVerificationException e) {
            return false;
        }
        DecodedJWT decodedJWT = JWT.decode(token);
        return !decodedJWT.getExpiresAt().after(Date.from(Instant.now()));
    }


    private String getSecret() {
        return new String(Base64.getDecoder().decode(secret));
    }
}
