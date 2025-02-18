package fit.iuh.com.service;

import fit.iuh.com.dao.ProductRepository;
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
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(UUID id) {
        return productRepository.findProductById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Product product, UUID id) {
        if (productRepository.findProductById(id) == null) {
            return null;
        }
        return productRepository.save(product);
    }
    public Page<Product> getProductsPaged(int page, int size, String search, String category) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return productRepository.searchProducts(search, category, pageable);
    }
    public List<Product> getSuggestions(String search) {
        return productRepository.suggestProducts(search);
    }
    public List<Product> getProductsByIds(List<String> productIds) {
        return productRepository.findProductsByListIds(productIds);
    }
}