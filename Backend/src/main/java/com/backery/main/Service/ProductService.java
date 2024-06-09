package com.backery.main.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.backery.main.DTO.ProductDTO;
import com.backery.main.Exception.EntityAlreadyExistsException;
import com.backery.main.Exception.NotFoundException;
import com.backery.main.Model.Product;
import com.backery.main.Repository.ProductRepository;
import com.backery.main.Response.MessageResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public MessageResponse createProduct(ProductDTO product) throws Exception {

        Optional<Product> existingProduct = productRepository
                .findByNameIgnoreCaseAndIgnoreSpaces(product.getProduct_name());

        if (existingProduct.isPresent()) {
            throw new EntityAlreadyExistsException("Product already exists");
        }

        Product newProduct = new Product();

        newProduct.setProduct_name(product.getProduct_name());
        newProduct.setDescription(product.getDescription());
        newProduct.setPrice(product.getPrice());
        newProduct.setProduct_image(product.getProduct_image());
        newProduct.setCreated_at(LocalDateTime.now());
        newProduct.setAvailability(product.getAvailability());

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
        productToUpdate.setProduct_image(product.getProduct_image());
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
