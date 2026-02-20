package com.flipkart.ecommerce.controller;

import com.flipkart.ecommerce.model.Product;
import com.flipkart.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    
    private final ProductRepository productRepository;
    
    private static final List<String> CATEGORIES = Arrays.asList(
        "Fridge", "Watch", "Phone", "Laptops", "Clothes", 
        "Tshirts", "Fan", "Cooler", "TV", "AC", "Bike", "Car", "Cycles"
    );
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        if (!CATEGORIES.contains(category)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(productRepository.findByCategory(category));
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(CATEGORIES);
    }
}
