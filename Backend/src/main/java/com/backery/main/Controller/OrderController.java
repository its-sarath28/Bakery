package com.backery.main.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backery.main.DTO.OrderDTO;
import com.backery.main.Response.CheckoutResponse;
import com.backery.main.Response.MessageResponse;
import com.backery.main.Service.OrderService;
import com.backery.main.Service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/order")
@Validated
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout() {
        try {
            OrderDTO order = orderService.createOrder();
            // String razorpayOrderId =
            // paymentService.createRazorpayOrder(order.getTotalAmount());
            return ResponseEntity.ok(new CheckoutResponse(order.getRazorpayOrderId(), order.getTotalAmount()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestParam String razorpayOrderId, @RequestParam String razorpayPaymentId,
            @RequestParam String razorpaySignature) {

        System.out.println("Received Razorpay Order ID: {}" + razorpayOrderId);
        System.out.println("Received Razorpay Payment ID: {}" + razorpayPaymentId);
        System.out.println("Received Razorpay Signature: {}" + razorpaySignature);

        boolean isPaymentValid = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (isPaymentValid) {
            orderService.updateOrderStatus(razorpayOrderId, "COMPLETED");
            return ResponseEntity.ok(new MessageResponse("Payment successful"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Payment verification failed"));
        }
    }
}
