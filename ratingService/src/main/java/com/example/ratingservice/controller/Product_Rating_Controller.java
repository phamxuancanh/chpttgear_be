package com.example.ratingservice.controller;
import com.example.ratingservice.model.Product_Rating;
import com.example.ratingservice.service.Product_Rating_Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class Product_Rating_Controller {

    private final Product_Rating_Service productRatingService;

    public Product_Rating_Controller(Product_Rating_Service productRatingService) {
        this.productRatingService = productRatingService;
    }

    @GetMapping("/product_ratings")
    public List<Product_Rating> getAllProductRatings(){
        return productRatingService.getAllProductRating();
    }
}
