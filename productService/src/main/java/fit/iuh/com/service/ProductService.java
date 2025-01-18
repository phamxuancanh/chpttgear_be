package fit.iuh.com.service;

import fit.iuh.com.dao.ProductDAO;
import fit.iuh.com.model.Product;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProductService {
    private ProductDAO productDAO;

    public ProductService(ProductDAO productDAO) {
        this.productDAO = productDAO;
    }

    public List<Product> getAllProduct() {
        return productDAO.findAll();
    }

    public Product getProduct(UUID id) {
        return productDAO.findProductById(id);
    }

    public Product createProduct(Product product) {
        return productDAO.save(product);
    }

    public Product updateProduct(Product product, UUID id) {
        if (productDAO.findProductById(id) == null) {
            return null;
        }
        return productDAO.save(product);
    }

    public List<Product> getAllProductByCategoryName(String name) {
        return productDAO.findProductByCategoryNameContaining(name);
    }

    public List<Product> getAllProductByName(String name) {
        return productDAO.findProductByNameContaining(name);
    }
}
