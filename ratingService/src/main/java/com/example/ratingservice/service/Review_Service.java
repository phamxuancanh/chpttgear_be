package com.example.ratingservice.service;

import com.example.ratingservice.dao.Review_DAO;
import com.example.ratingservice.model.Review;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
@Service
@Transactional
public class Review_Service {
    private Review_DAO review_DAO;

    public Review_Service(Review_DAO review_DAO) {
        this.review_DAO = review_DAO;
    }

    public List<Review> getAllReviews() {
        return review_DAO.findAll();
    }

    public Review getReviewById(UUID id) {
        return review_DAO.findReviewById(id);
    }
}
