package com.example.ratingservice.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "product_ratings")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product_Rating {
    @Id
    @UuidGenerator(style = UuidGenerator.Style.RANDOM)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "category", nullable = false, length = 255)
    private String category;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "average_rating", precision = 2, scale = 1, nullable = false)
    private BigDecimal averageRating;

    @Column(name = "total_reviews", nullable = false)
    private int totalReviews;

    @PrePersist
    @PreUpdate
    private void validateRatings() {
        if (averageRating != null && (averageRating.compareTo(BigDecimal.ZERO) < 0 || averageRating.compareTo(BigDecimal.valueOf(5)) > 0)) {
            throw new IllegalArgumentException("Average rating must be between 0 and 5.");
        }
        if (totalReviews < 0) {
            throw new IllegalArgumentException("Total reviews cannot be negative.");
        }
    }
}
