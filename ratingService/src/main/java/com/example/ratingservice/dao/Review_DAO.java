package com.example.ratingservice.dao;

import com.example.ratingservice.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface Review_DAO extends JpaRepository<Review, UUID> {
    Review findReviewById(UUID reviewId);
}
