package fit.iuh.com.service;

import fit.iuh.com.repository.ProductRepository;
import fit.iuh.com.dto.ProductWithCategory_DTO;
import fit.iuh.com.model.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
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
        return productRepository.findById(id).orElse(null);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Product product, UUID id) {
        productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        Product updatedProduct = productRepository.findById(id).orElse(null);
        System.out.println(updatedProduct.getName());
        updatedProduct.setDescription(product.getDescription());
        updatedProduct.setSize(product.getSize());
        updatedProduct.setWeight(product.getWeight());
        updatedProduct.setColor(product.getColor());
        updatedProduct.setImage(product.getImage());
        updatedProduct.setGuaranteePeriod(product.getGuaranteePeriod());
        return productRepository.save(updatedProduct);
    }

    public Page<Product> getProductsPaged(int page, int size, String search, String category, String color,
            Double price_gte, Double price_lte, List<String> specs, Long specCount) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return productRepository.searchProducts(search, category, color, price_gte, price_lte, specs, specCount,
                pageable);
    }

    public Page<Product> getProductsForManagement(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return productRepository.getProductForManagement(pageable);
    }

    public List<Product> getSuggestions(String search) {
        return productRepository.suggestProducts(search);
    }

    public List<Product> getProductsByIds(List<String> productIds) {
        return productRepository.findProductsByListIds(productIds);
    }

    public List<ProductWithCategory_DTO> getProductWithCategory() {
        return productRepository.getAllProductWithCategory();
    }

    public Product updatePriceByProductId(UUID productId, double price) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return null;
        }
        product.setPrice(price);
        return productRepository.save(product);
    }
        public List<Product> getSimilarProducts(UUID productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return Collections.emptyList();
        }

        return productRepository.findSimilarProducts(
                productId,
                product.getCategory().getId(),
                product.getBrand(),
                product.getColor(),
                product.getSize(),
                // product.getPrice() - 10000000,
                // product.getPrice() + 10000000,
                PageRequest.of(0, 5)
        );
    }
}