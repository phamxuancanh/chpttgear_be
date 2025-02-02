package com.example.ratingservice.controller;
import com.example.ratingservice.model.Review;
import com.example.ratingservice.service.Review_Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class ReviewController {

    private final Review_Service reviewService;

    public ReviewController(Review_Service reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/reviews")
    public List<Review> getAllReviews(){
        return reviewService.getAllReviews();
    }


    @GetMapping("/reviews/{id}")
    public Review getReviewById(@PathVariable UUID id){
        Review review = reviewService.getReviewById(id);
        if(review == null){
            return null;
        } else {
            return review;
        }
    }
}
