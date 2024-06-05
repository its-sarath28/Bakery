package com.backery.main.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpDTO {

    @NotNull
    @NotBlank(message = "Full name is required")
    private String full_name;

    @NotNull
    @NotBlank(message = "Email is required")
    private String email;

    @NotNull
    @NotBlank(message = "Password is required")
    private String password;
}
