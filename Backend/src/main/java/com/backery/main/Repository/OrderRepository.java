package com.backery.main.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backery.main.Model.Order;
import com.backery.main.Model.User;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    List<Order> findByUserAndStatus(User user, String status);
}
