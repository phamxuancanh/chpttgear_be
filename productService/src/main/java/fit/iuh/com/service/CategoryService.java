package fit.iuh.com.service;

import fit.iuh.com.dao.CategoryDAO;
import fit.iuh.com.model.Category;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {
    private CategoryDAO categoryDAO;

    public CategoryService(CategoryDAO categoryDAO) {
        this.categoryDAO = categoryDAO;
    }

    public List<Category> getAllCategories() {
        return categoryDAO.findAll();
    }

    public Category getCategoryById(UUID id){
        return categoryDAO.findById(id).orElse(null);
    }
}
