package com.backery.main.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignInDTO {
    @NotNull
    @NotBlank(message = "Email is required")
    @Column(name = "email")
    private String email;

    @NotNull
    @NotBlank(message = "Password is required")
    @Column(name = "password")
    private String password;
}
