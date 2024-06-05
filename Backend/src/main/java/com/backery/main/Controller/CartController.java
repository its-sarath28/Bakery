package com.backery.main.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backery.main.DTO.CartResponseDTO;
import com.backery.main.Response.MessageResponse;
import com.backery.main.Service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cart")
@Validated
public class CartController {

    private final CartService cartService;

    @GetMapping("")
    public ResponseEntity<?> getCurrentUserCart() {
        try {
            CartResponseDTO cartResponse = cartService.getCurrentUserCart();
            return ResponseEntity.ok(cartResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/add-product")
    public ResponseEntity<MessageResponse> addProductToCart(@RequestParam Long productId, @RequestParam int quantity) {
        try {
            cartService.addProductToCart(productId, quantity);
            return ResponseEntity.ok(new MessageResponse("Product added to cart successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/update-product")
    public ResponseEntity<MessageResponse> updateCartItem(@RequestParam Long productId, @RequestParam int quantity) {
        try {
            cartService.updateCartItem(productId, quantity);
            return ResponseEntity.ok(new MessageResponse("Cart updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/remove-product")
    public ResponseEntity<MessageResponse> removeCartItem(@RequestParam Long productId) {
        try {
            cartService.removeCartItem(productId);
            return ResponseEntity.ok(new MessageResponse("Cart updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse(e.getMessage()));
        }
    }
}
