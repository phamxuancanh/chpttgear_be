package com.example.ratingservice.service;

import com.example.ratingservice.dao.Review_Reply_DAO;
import com.example.ratingservice.model.Review_Reply;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class Review_Reply_Service {
    private Review_Reply_DAO reviewReplyDao;

    public Review_Reply_Service(Review_Reply_DAO reviewReplyDao) {
        this.reviewReplyDao = reviewReplyDao;
    }

    public List<Review_Reply> getAll() {
        return reviewReplyDao.findAll();
    }

    public Review_Reply getById(UUID id) {
        return reviewReplyDao.getReview_ReplyById(id);
    }

    public Review_Reply createOne(Review_Reply review_Reply) {
        return reviewReplyDao.save(review_Reply);
    }

    public Review_Reply updateOne(Review_Reply review_Reply, UUID id) {
        Review_Reply updatedReview = reviewReplyDao.getReview_ReplyById(id);
        if(updatedReview == null){
            return null;
        } else {
            return reviewReplyDao.save(review_Reply);
        }
    }

    public Review_Reply deleteOne(UUID id) {
        Review_Reply deletedReview = reviewReplyDao.getReview_ReplyById(id);
        if(deletedReview == null){
            return null;
        } else {
            reviewReplyDao.delete(deletedReview);
            return deletedReview;
        }
    }
}
