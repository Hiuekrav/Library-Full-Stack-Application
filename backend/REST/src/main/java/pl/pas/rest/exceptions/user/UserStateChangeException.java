package pl.pas.rest.exceptions.user;

public class UserStateChangeException extends UserBaseException {
    public UserStateChangeException() {
        super();
    }

    public UserStateChangeException(String message) {
        super(message);
    }

    public UserStateChangeException(String message, Throwable cause) {
        super(message, cause);
    }

    public UserStateChangeException(Throwable cause) {
        super(cause);
    }
}
