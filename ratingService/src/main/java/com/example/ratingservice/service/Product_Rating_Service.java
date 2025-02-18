package com.example.ratingservice.service;

import com.example.ratingservice.dao.Product_Rating_DAO;
import com.example.ratingservice.model.Product_Rating;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class Product_Rating_Service {
    private Product_Rating_DAO productRatingDao;

    public Product_Rating_Service(Product_Rating_DAO productRatingDao) {
        this.productRatingDao = productRatingDao;
    }

    public List<Product_Rating> getAll() {
        return productRatingDao.findAll();
    }

    public Product_Rating getById(UUID id) {
        return productRatingDao.findProduct_RatingById(id);
    }

    public Product_Rating createOne(Product_Rating productRating) {
        return productRatingDao.save(productRating);
    }

    public Product_Rating updateOne(Product_Rating productRating, UUID id) {
        Product_Rating productRatingUpdate = productRatingDao.findProduct_RatingById(id);
        if (productRatingUpdate == null) {
            return null;
        } else {
            return productRatingDao.save(productRating);
        }
    }

    public Product_Rating deleteOne(UUID id) {
        Product_Rating productRating = productRatingDao.findProduct_RatingById(id);
        if (productRating == null) {
            return null;
        } else {
            productRatingDao.delete(productRating);
            return productRating;
        }
    }
}
