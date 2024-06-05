package com.backery.main.DTO;

import com.backery.main.Model.Product;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemDTO {

    private Long id;
    private int quantity;
    private ProductDTO product;

    public CartItemDTO(Long id, int quantity, Product product) {
        this.id = id;
        this.quantity = quantity;
        this.product = new ProductDTO(product);
    }

}
