package com.example.ratingservice.controller;

import com.example.ratingservice.model.Review_Reply;
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
    public List<Review_Reply> getAllReviews() {
        return reviewService.getAll();
    }

    @GetMapping("/reviews/{id}")
    public Review getReviewById(@PathVariable UUID id) {
        Review review = reviewService.getById(id);
        if (review == null) {
            return null;
        } else {
            return review;
        }
    }

    @PostMapping("/reviews/")
    public Review createReview(@RequestBody Review review) {
        return reviewService.createOne(review);
    }

    @PutMapping("/reviews/{id}")
    public Review updateReview(@RequestBody Review review, @PathVariable UUID id) {
        return reviewService.updateOne(review, id);
    }

    @DeleteMapping("/reviews/{id}")
    public Review deleteReviewById(@PathVariable UUID id) {
        return reviewService.deleteOne(id);
    }
}
