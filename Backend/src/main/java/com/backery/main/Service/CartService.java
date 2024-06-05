package com.backery.main.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.backery.main.DTO.CartItemDTO;
import com.backery.main.DTO.CartResponseDTO;
import com.backery.main.Exception.NotFoundException;
import com.backery.main.Model.Cart;
import com.backery.main.Model.CartItem;
import com.backery.main.Model.Product;
import com.backery.main.Model.User;
import com.backery.main.Repository.CartRepository;
import com.backery.main.Repository.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    @Transactional
    public Cart getCurrentUserCartEntity() {
        User user = userService.getCurrentUser();
        return cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("not_found", "Cart not found"));
    }

    public CartResponseDTO getCurrentUserCart() {
        User user = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("not_found", "Cart not found"));

        List<CartItemDTO> cartItems = cart.getItems().stream()
                .map(this::convertToCartItemDTO)
                .collect(Collectors.toList());

        double totalSum = cartItems.stream()
                .mapToDouble(item -> item.getQuantity() * item.getProduct().getPrice())
                .sum();

        return new CartResponseDTO(cartItems, totalSum);
    }

    private CartItemDTO convertToCartItemDTO(CartItem cartItem) {
        return new CartItemDTO(cartItem.getId(), cartItem.getQuantity(), cartItem.getProduct());
    }

    @Transactional
    public void clearCart(Cart cart) {
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Transactional
    public void addProductToCart(Long productId, int quantity) {
        User user = userService.getCurrentUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("not_found", "Product not found"));

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> createCart(user));

        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setCart(cart);
            cart.getItems().add(cartItem);
        }

        cartRepository.save(cart);
    }

    private Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setItems(new ArrayList<>());
        return cartRepository.save(cart);
    }

    @Transactional
    public void updateCartItem(Long productId, int quantity) {
        User user = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("not_found", "Cart not found"));

        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("not_found", "Cart item not found"));

        if (quantity <= 0) {
            removeCartItem(cart, cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartRepository.save(cart);
        }
    }

    @Transactional
    public void removeCartItem(Long productId) {
        User user = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("not_found", "Cart not found"));

        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("not_found", "Cart item not found"));

        removeCartItem(cart, cartItem);
    }

    private void removeCartItem(Cart cart, CartItem cartItem) {
        cart.getItems().remove(cartItem);
        if (cart.getItems().isEmpty()) {
            cartRepository.delete(cart);
        } else {
            cartRepository.save(cart);
        }
    }
}
