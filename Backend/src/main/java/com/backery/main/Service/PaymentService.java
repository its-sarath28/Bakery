package com.backery.main.Service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@Service
public class PaymentService {

    @Value("${razorpay.key_id}")
    private String key_id;

    @Value("${razorpay.key_secret}")
    private String key_secret;

    public String createRazorpayOrder(double amount) throws Exception {
        RazorpayClient razorpayClient = new RazorpayClient(key_id, key_secret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("payment_capture", true);

        Order order = razorpayClient.orders.create(orderRequest);
        return order.get("id");
    }

    public boolean verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            String data = razorpayOrderId + "|" + razorpayPaymentId;
            return Utils.verifySignature(data, razorpaySignature, key_secret);
        } catch (Exception e) {
            return false;
        }
    }
}
