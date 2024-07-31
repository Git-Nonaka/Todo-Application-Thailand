package com.example.todoApp.model;

//setting validate result

public class ValidateResult {
    private final boolean ok;
    private final String errorMessage;

    private ValidateResult(boolean ok, String errorMessage) {
        this.ok = ok;
        this.errorMessage = errorMessage;
    }

    public boolean ok() {
        return ok;
    }

    public String errorMessage() {
        return errorMessage;
    }

    public static ValidateResult success() {
        return new ValidateResult(true, "");
    }

    public static ValidateResult failed(String errorMessage) {
        return new ValidateResult(false, errorMessage);
    }
}
