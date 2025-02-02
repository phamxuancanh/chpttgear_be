package com.example.ratingservice.service;

import com.example.ratingservice.dao.Review_Reply_DAO;
import com.example.ratingservice.model.Review_Reply;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Transactional
public class Review_Reply_Service {
    private Review_Reply_DAO reviewReplyDao;

    public Review_Reply_Service(Review_Reply_DAO reviewReplyDao) {
        this.reviewReplyDao = reviewReplyDao;
    }

    public List<Review_Reply> getAllReview_Reply() {
        return reviewReplyDao.findAll();
    }

}
