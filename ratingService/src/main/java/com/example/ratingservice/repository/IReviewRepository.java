package com.example.ratingservice.repository;

@Repository
public interface IReviewRepository extends JpaRepository<Review, UUID> {
    Review findReviewById(UUID reviewId);
}