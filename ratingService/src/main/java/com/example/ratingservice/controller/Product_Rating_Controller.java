package com.example.ratingservice.controller;
import com.example.ratingservice.model.Product_Rating;
import com.example.ratingservice.service.Product_Rating_Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class Product_Rating_Controller {

    private final Product_Rating_Service productRatingService;

    public Product_Rating_Controller(Product_Rating_Service productRatingService) {
        this.productRatingService = productRatingService;
    }

    @GetMapping("/product_ratings")
    public List<Product_Rating> getAllProductRatings(){
        return productRatingService.getAll();
    }

    @GetMapping("/product_ratings/{id}")
    public Product_Rating getProductRating(@PathVariable UUID id){
        return productRatingService.getById(id);
    }

    @PostMapping("/product_ratings")
    public Product_Rating createProductRating(@RequestBody Product_Rating productRating){
        return productRatingService.createOne(productRating);
    }

    @PutMapping("/product_ratings/{id}")
    public Product_Rating updateProductRating(@RequestBody Product_Rating productRating, @PathVariable UUID id){
        return productRatingService.updateOne(productRating, id);
    }

    @DeleteMapping("/product_ratings{id}")
    public Product_Rating deleteProductRating(@PathVariable UUID id){
        return productRatingService.deleteOne(id);
    }
}
