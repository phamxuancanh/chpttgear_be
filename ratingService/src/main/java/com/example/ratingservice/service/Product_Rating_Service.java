package com.example.ratingservice.service;

import com.example.ratingservice.dao.Product_Rating_DAO;
import com.example.ratingservice.model.Product_Rating;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Transactional
public class Product_Rating_Service {
    private Product_Rating_DAO productRatingDao;

    public Product_Rating_Service(Product_Rating_DAO productRatingDao) {
        this.productRatingDao = productRatingDao;
    }

    public List<Product_Rating> getAllProductRating() {
        return productRatingDao.findAll();
    }

}
