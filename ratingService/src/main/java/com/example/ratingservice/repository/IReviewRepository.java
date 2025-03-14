package com.example.ratingservice.Repository;

import com.example.ratingservice.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface IReviewRepository extends JpaRepository<Review, UUID> {
    public interface ReviewProjection {
        UUID getId();
        int getRating();
        String getReview();
        UUID getUserId();
        UUID getReplyId();
        UUID getProductId();
        String getParentId();
        Instant getCreateDate();
        Instant getUpdateDate();
        String getName();
    }
    @Query(value = "Select R.*, CONCAT(U.\"firstName\", ' ', U.\"lastName\") AS name  From public.reviews R join public.users U ON R.user_id = U.id WHERE R.product_id = :product_id", nativeQuery = true)
    List<ReviewProjection> findByProductId(@Param("product_id") UUID product_id);
}
