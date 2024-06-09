package com.backery.main.DTO;

import com.backery.main.Model.Product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {

    private Long id;

    @NotNull(message = "Product name is required")
    @NotBlank(message = "Product name cannot be blank")
    private String product_name;

    @NotNull(message = "Product description is required")
    @NotBlank(message = "Product description cannot be blank")
    private String description;

    @NotNull(message = "Product price is required")
    private Double price;

    @NotNull(message = "Product image is required")
    @NotBlank(message = "Product image cannot be blank")
    private String product_image;

    @NotNull(message = "Product availability is required")
    private Boolean availability;

    public ProductDTO(Product product) {
        this.id = product.getId();
        this.product_name = product.getProduct_name();
        this.product_image = product.getProduct_image();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.availability = product.getAvailability();
    }
}
