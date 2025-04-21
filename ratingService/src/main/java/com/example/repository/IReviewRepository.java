package com.example.repository;

import com.example.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
    public interface RatingStatsProjection {
        Integer getRating5();
        Integer getRating3to4();
        Integer getRating1to2();
    }
    @Query(value = "Select R.*, CONCAT(U.\"firstName\", ' ', U.\"lastName\") AS name  From public.reviews R join public.users U ON R.user_id = U.id WHERE R.product_id = :product_id", nativeQuery = true)
    List<ReviewProjection> findByProductId(@Param("product_id") UUID product_id);

    @Query(value = "SELECT R.*, CONCAT(U.\"firstName\", ' ', U.\"lastName\") AS name, R.create_date, R.update_date "
            + "FROM public.reviews R "
            + "JOIN public.users U ON R.user_id = U.id "
            + "WHERE R.reply_id IS NULL",
            countQuery = "SELECT COUNT(*) FROM public.reviews R WHERE R.reply_id IS NULL",
            nativeQuery = true)
    Page<ReviewProjection> findAllParentReviews(Pageable pageable);

    @Query(value = "SELECT R.*, CONCAT(U.\"firstName\", ' ', U.\"lastName\") AS name, R.create_date, R.update_date "
            + "FROM public.reviews R "
            + "JOIN public.users U ON R.user_id = U.id "
            + "WHERE R.product_id = :product_id AND R.reply_id IS NULL",
            countQuery = "SELECT COUNT(*) FROM public.reviews R WHERE R.product_id = :product_id AND R.reply_id IS NULL",
            nativeQuery = true)
    Page<ReviewProjection> findParentReviewsByProductId(@Param("product_id") UUID productId, Pageable pageable);

    @Query(value = "SELECT "
            + "COUNT(*) FILTER (WHERE rating = 5) AS rating5, "
            + "COUNT(*) FILTER (WHERE rating BETWEEN 3 AND 4) AS rating3to4, "
            + "COUNT(*) FILTER (WHERE rating BETWEEN 1 AND 2) AS rating1to2 "
            + "FROM public.reviews "
            + "WHERE reply_id IS NULL",
            nativeQuery = true)
    RatingStatsProjection countReviewRatingGroups();
}
