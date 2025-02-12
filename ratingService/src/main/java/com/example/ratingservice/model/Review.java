package com.example.ratingservice.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.UUID;
@Entity
@Table(name = "reviews")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Review {
    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.RANDOM)
    @Column(name = "category_id")
    private UUID id;
    @Column(columnDefinition = "VARCHAR(255)")
    private String userId;
    @Column(columnDefinition = "VARCHAR(255)")
    private String productId;
    @Column
    private int rating;
    @Column(columnDefinition = "TEXT")
    private String comment;
}
