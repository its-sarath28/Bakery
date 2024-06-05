package com.backery.main.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backery.main.DTO.SignInDTO;
import com.backery.main.DTO.SignUpDTO;
import com.backery.main.Response.AuthResponse;
import com.backery.main.Service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@Validated
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/admin/sign-up")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpDTO admin) throws Exception {
        return ResponseEntity.ok(authService.signUp(admin));
    }

    @PostMapping("/admin/sign-in")
    public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody SignInDTO admin) {
        return ResponseEntity.ok(authService.signIn(admin));
    }
}
