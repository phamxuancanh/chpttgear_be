package com.example.ratingservice.service;

import com.example.ratingservice.dao.Review_DAO;
import com.example.ratingservice.model.Review_Reply;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

public class Review_Service implements IReviewService {
    private review_DAO review_DAO;

    public Review_Service(Review_DAO review_DAO) {
        this.review_DAO = review_DAO;
    }

    public List<Review_Reply> getAll() {
        return review_DAO.findAll();
    }

    public Review getById(UUID id) {
        return review_DAO.findReviewById(id);
    }

    public Review createOne(Review review) {
        return review_DAO.save(review);
    }

    public Review updateOne(Review review, UUID id) {
        Review updatedReview = review_DAO.findReviewById(id);
        if (updatedReview == null) {
            return null;
        } else {
            return review_DAO.save(review);
        }
    }

    public Review deleteOne(UUID id) {
        Review review = review_DAO.findReviewById(id);
        if (review == null) {
            return null;
        } else {
            review_DAO.delete(review);
            return review;
        }
    }
}
