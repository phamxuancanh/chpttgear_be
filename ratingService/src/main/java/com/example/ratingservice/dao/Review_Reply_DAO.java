package com.example.ratingservice.dao;

import com.example.ratingservice.model.Review_Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface Review_Reply_DAO extends JpaRepository<Review_Reply, UUID> {
    Review_Reply getReview_ReplyById(UUID id);
}
