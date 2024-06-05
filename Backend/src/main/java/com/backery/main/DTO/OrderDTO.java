package com.backery.main.DTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.backery.main.Model.Order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDTO {
    private Long id;
    private Long userId;
    private List<OrderItemDTO> items;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private String razorpayOrderId;

    public OrderDTO(Order order) {
        this.id = order.getId();
        this.userId = order.getUser().getId();
        this.items = order.getItems().stream()
                .map(item -> new OrderItemDTO(item.getProduct().getId(), item.getQuantity(), item.getPrice()))
                .collect(Collectors.toList());
        this.totalAmount = order.getTotalAmount();
        this.status = order.getStatus();
        this.createdAt = order.getCreatedAt();
        this.razorpayOrderId = order.getRazorpayOrderId();
    }
}
