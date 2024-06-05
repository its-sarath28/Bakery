package com.backery.main.DTO;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartResponseDTO {
    private List<CartItemDTO> items;
    private double totalSum;

    public CartResponseDTO(List<CartItemDTO> items, double totalSum) {
        this.items = items;
        this.totalSum = totalSum;
    }
}
