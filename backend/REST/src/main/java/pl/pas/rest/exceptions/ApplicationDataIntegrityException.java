package pl.pas.rest.exceptions;

import pl.pas.rest.utils.consts.I18n;

public class ApplicationDataIntegrityException extends ApplicationBaseException {

    public ApplicationDataIntegrityException() {
        super(I18n.APPLICATION_DATA_INTEGRITY_EXCEPTION);
    }

    public ApplicationDataIntegrityException(String message) {
        super(message);
    }
}
