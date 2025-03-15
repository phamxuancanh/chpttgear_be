package com.example.ratingservice.controller;

import com.example.ratingservice.Repository.IReviewRepository;
import com.example.ratingservice.entity.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/review")
@CrossOrigin(origins = "*")
public class ReviewController {
    @Autowired
    private final IReviewRepository iReviewRepository;

    public ReviewController(IReviewRepository iReviewRepository) {
        this.iReviewRepository = iReviewRepository;
    }

    @GetMapping("/{productId}")
    public ResponseEntity<List<IReviewRepository.ReviewProjection>> getReviewByProductId(@PathVariable UUID productId) {
        List<IReviewRepository.ReviewProjection> reviews = iReviewRepository.findByProductId(productId);
        if (reviews.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(reviews);
    }

    @PostMapping()
    public ResponseEntity<String> createReview(@RequestBody Review param) {
        iReviewRepository.save(param);
        return ResponseEntity.status(HttpStatus.CREATED).body("Review created successfully!");
    }

    @PutMapping()
    public ResponseEntity<String> updateReview(@RequestBody Review param) {
        iReviewRepository.save(param);
        return ResponseEntity.status(HttpStatus.CREATED).body("Review updated successfully!");
    }

}
