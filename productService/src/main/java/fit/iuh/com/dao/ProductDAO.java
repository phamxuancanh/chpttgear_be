package fit.iuh.com.dao;

import fit.iuh.com.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProductDAO extends JpaRepository<Product, UUID> {
    Product findProductById(UUID id);

    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(CAST(p.name AS string)) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%'))) " +
            "AND (:category IS NULL OR p.category.name = :category)")
    Page<Product> searchProducts(
            @Param("name") String name,
            @Param("category") String category,
            Pageable pageable
    );

}
