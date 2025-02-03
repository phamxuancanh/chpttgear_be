package fit.iuh.com.dao;

import fit.iuh.com.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findProductByNameContaining(String productName);
    List<Product> findProductByCategoryNameContaining(String categoryName);
}
