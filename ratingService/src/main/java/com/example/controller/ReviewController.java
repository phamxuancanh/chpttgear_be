package com.example.controller;

import com.example.repository.IReviewRepository;
import com.example.entity.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("api/v1/review/")
public class ReviewController {

    @Autowired
    private final IReviewRepository iReviewRepository;

    public ReviewController(IReviewRepository iReviewRepository) {
        this.iReviewRepository = iReviewRepository;
    }

    // ✅ Lấy tất cả review (bao gồm cả phản hồi) của sản phẩm
    @GetMapping("{productId}")
    public ResponseEntity<List<IReviewRepository.ReviewProjection>> getReviewByProductId(@PathVariable UUID productId) {
        List<IReviewRepository.ReviewProjection> reviews = iReviewRepository.findByProductId(productId);
        if (reviews == null) {
            reviews = new ArrayList<>();
        }
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("parent")
    public ResponseEntity<Page<IReviewRepository.ReviewProjection>> getAllParentReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<IReviewRepository.ReviewProjection> reviews = iReviewRepository.findAllParentReviews(pageable);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("parent/{productId}")
    public ResponseEntity<Page<IReviewRepository.ReviewProjection>> getParentReviewsByProductId(
            @PathVariable UUID productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<IReviewRepository.ReviewProjection> reviews = iReviewRepository.findParentReviewsByProductId(productId, pageable);
        return ResponseEntity.ok(reviews);
    }

    // ✅ Thêm review mới
    @PostMapping()
    public ResponseEntity<String> createReview(@RequestBody Review param) {
        iReviewRepository.save(param);
        return ResponseEntity.status(HttpStatus.CREATED).body("Review created successfully!");
    }

    // ✅ Cập nhật review
    @PutMapping()
    public ResponseEntity<String> updateReview(@RequestBody Review param) {
        iReviewRepository.save(param);
        return ResponseEntity.status(HttpStatus.CREATED).body("Review updated successfully!");
    }
}
