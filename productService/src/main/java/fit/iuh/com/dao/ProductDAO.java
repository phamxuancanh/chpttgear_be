package fit.iuh.com.dao;

import fit.iuh.com.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductDAO extends JpaRepository<Product, UUID> {
    Product findProductById(UUID id);
    List<Product> findProductByNameContaining(String productName);
    List<Product> findProductByCategoryNameContaining(String categoryName);
}
