package com.example.controller;

import com.example.repository.IReviewRepository;
import com.example.entity.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/review/")
public class ReviewController {
    @Autowired
    private final IReviewRepository iReviewRepository;

    public ReviewController(IReviewRepository iReviewRepository) {
        this.iReviewRepository = iReviewRepository;
    }

    @GetMapping("{productId}")
    public ResponseEntity<List<IReviewRepository.ReviewProjection>> getReviewByProductId(@PathVariable UUID productId) {
        List<IReviewRepository.ReviewProjection> reviews = iReviewRepository.findByProductId(productId);

        // Đảm bảo luôn trả về danh sách, không bao giờ là null
        if (reviews == null) {
            reviews = new ArrayList<>();
        }

        System.out.println(reviews);
        return ResponseEntity.ok(reviews);
    }


    @PostMapping()
    public ResponseEntity<String> createReview(@RequestBody Review param) {
        System.out.println((param));
        iReviewRepository.save(param);
        return ResponseEntity.status(HttpStatus.CREATED).body("Review created successfully!");
    }

    @PutMapping()
    public ResponseEntity<String> updateReview(@RequestBody Review param) {
        iReviewRepository.save(param);
        return ResponseEntity.status(HttpStatus.CREATED).body("Review updated successfully!");
    }

}
