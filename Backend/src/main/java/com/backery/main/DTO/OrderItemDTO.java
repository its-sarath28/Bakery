package com.backery.main.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemDTO {
    private Long productId;
    private int quantity;
    private Double price;

    public OrderItemDTO(Long productId, int quantity, Double price) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }
}