package com.backery.main.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.backery.main.DTO.ProductDTO;
import com.backery.main.Exception.EntityAlreadyExistsException;
import com.backery.main.Exception.NotFoundException;
import com.backery.main.Model.Product;
import com.backery.main.Model.User;
import com.backery.main.Repository.ProductRepository;
import com.backery.main.Response.MessageResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    private final UserService userService;

    public MessageResponse createProduct(ProductDTO product) throws Exception {

        Optional<Product> existingProduct = productRepository
                .findByNameIgnoreCaseAndIgnoreSpaces(product.getProduct_name());

        if (existingProduct.isPresent()) {
            throw new EntityAlreadyExistsException("Product already exists");
        }

        User user = userService.getCurrentUser();

        Product newProduct = new Product();

        newProduct.setProduct_name(product.getProduct_name());
        newProduct.setDescription(product.getDescription());
        newProduct.setPrice(product.getPrice());
        newProduct.setCreated_at(LocalDateTime.now());
        newProduct.setFood_type(product.getFood_type());
        newProduct.setAvailability(product.getAvailability());
        newProduct.setUser(user);

        productRepository.save(newProduct);

        return new MessageResponse("Product created successfully");
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("not_found", "Product not found"));

        return product;
    }

    public MessageResponse updateProduct(Long productId, ProductDTO product) {
        Product productToUpdate = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("not_found", "Product not found"));

        productToUpdate.setProduct_name(product.getProduct_name());
        productToUpdate.setDescription(product.getDescription());
        productToUpdate.setPrice(product.getPrice());
        productToUpdate.setFood_type(product.getFood_type());
        productToUpdate.setAvailability(product.getAvailability());

        productRepository.save(productToUpdate);

        return new MessageResponse("Product updated successfully");
    }

    public MessageResponse deleteProduct(Long productId) {
        Product productToDelete = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("not_found", "Product not found"));

        productRepository.delete(productToDelete);

        return new MessageResponse("Product deleted successfully");
    }
}
