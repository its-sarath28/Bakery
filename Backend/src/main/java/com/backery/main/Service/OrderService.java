package com.backery.main.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.backery.main.DTO.OrderDTO;
import com.backery.main.Exception.NotFoundException;
import com.backery.main.Model.Cart;
import com.backery.main.Model.Order;
import com.backery.main.Model.OrderItem;
import com.backery.main.Model.User;
import com.backery.main.Repository.OrderRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final UserService userService;
    private final PaymentService paymentService;

    @Transactional
    public OrderDTO createOrder() throws Exception {
        User user = userService.getCurrentUser();
        Cart cart = cartService.getCurrentUserCartEntity();

        if (cart == null || cart.getItems().isEmpty()) {
            throw new NotFoundException("not_found", "Cart is empty");
        }

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setPrice(cartItem.getProduct().getPrice());
                    return orderItem;
                }).collect(Collectors.toList());

        double totalAmount = orderItems.stream()
                .mapToDouble(item -> item.getQuantity() * item.getPrice())
                .sum();

        String razorpayOrderId = paymentService.createRazorpayOrder(totalAmount);

        System.out.println("Order id in create :=> " + razorpayOrderId);

        Order order = new Order();
        order.setUser(user);
        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setRazorpayOrderId(razorpayOrderId);

        Order savedOrder = orderRepository.save(order);

        // Clear the cart after creating order
        cartService.clearCart(cart);

        return new OrderDTO(savedOrder);
    }

    public void updateOrderStatus(String razorpayOrderId, String status) {
        System.out.println("The order id is :=> " + razorpayOrderId);
        Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new NotFoundException("not_found", "Order not found"));

        order.setStatus(status);
        orderRepository.save(order);
    }

    public List<OrderDTO> getCompletedOrdersForCurrentUser() {
        User user = userService.getCurrentUser();
        List<Order> completedOrders = orderRepository.findByUserAndStatus(user, "COMPLETED");
        return completedOrders.stream().map(OrderDTO::new).collect(Collectors.toList());
    }
}
