package fit.iuh.com.service;

import fit.iuh.com.dao.ProductDAO;
import fit.iuh.com.model.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProductService {
    private final ProductDAO productDAO;

    public ProductService(ProductDAO productDAO) {
        this.productDAO = productDAO;
    }

    public List<Product> getAllProducts() {
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
    public Page<Product> getProductsPaged(int page, int size, String search, String category) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return productDAO.searchProducts(search, category, pageable);
    }
    public List<Product> getSuggestions(String search) {
        return productDAO.suggestProducts(search);
    }
    public List<Product> getProductsByIds(List<String> productIds) {
        return productDAO.findProductsByListIds(productIds);
    }
}
