package com.backery.main.Exception;

public class NotFoundException extends RuntimeException {
    private final String fieldName;

    public NotFoundException(String fieldName, String message) {
        super(message);
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
