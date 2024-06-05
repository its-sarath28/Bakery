package com.backery.main.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backery.main.Model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE LOWER(REPLACE(p.product_name, ' ', '')) = LOWER(REPLACE(:product_name, ' ', ''))")
    Optional<Product> findByNameIgnoreCaseAndIgnoreSpaces(@Param("product_name") String product_name);
}
