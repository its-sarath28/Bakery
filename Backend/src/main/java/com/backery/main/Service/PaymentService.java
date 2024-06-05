package com.backery.main.Service;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@Service
public class PaymentService {

    private final String key_id = "";
    private final String key_secret = "";

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
