package com.backery.main.DTO;

import com.backery.main.Model.OrderItem;
import com.backery.main.Model.Product;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemDTO {
    private Long productId;
    private String productName;
    private String productImage;
    private String productDescription;
    private Double productPrice;
    private int quantity;
    private Double price;

    public OrderItemDTO(OrderItem orderItem) {
        Product product = orderItem.getProduct();
        this.productId = product.getId();
        this.productName = product.getProduct_name();
        this.productImage = product.getProduct_image();
        this.productDescription = product.getDescription();
        this.productPrice = product.getPrice();
        this.quantity = orderItem.getQuantity();
        this.price = orderItem.getPrice();
    }
}