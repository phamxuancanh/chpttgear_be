package fit.iuh.com.service;

import fit.iuh.com.dao.ProductRepository;
import fit.iuh.com.model.Product;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

    public Product getProduct(UUID id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Product product, UUID id) {
        if (productRepository.findById(id).orElse(null) == null) {
            return null;
        }
        return productRepository.save(product);
    }

    public List<Product> getProductsByCategoryName(String categoryName) {
        return productRepository.findProductByCategoryNameContaining(categoryName);
    }

    public List<Product> getProductsByName(String productName) {
        return productRepository.findProductByNameContaining(productName);
    }

    public Product deleteProduct(UUID id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            productRepository.delete(product);
        }
        return product;
    }
}
