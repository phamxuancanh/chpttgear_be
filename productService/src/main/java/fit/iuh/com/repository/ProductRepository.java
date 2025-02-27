package fit.iuh.com.repository;

import fit.iuh.com.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

        @Query("SELECT p FROM Product p " +
        "WHERE (:name IS NULL OR LOWER(CAST(p.name AS text)) LIKE LOWER(CONCAT('%', CAST(:name AS text), '%'))) " +
        "  AND (:category IS NULL OR p.category.name = :category) " +
        "  AND (:color IS NULL OR p.color = :color) " +
        "  AND (:price_gte IS NULL OR p.price >= :price_gte) " +
        "  AND (:price_lte IS NULL OR p.price <= :price_lte) " +
        "  AND (:specCount = 0 OR " +
        "       (SELECT COUNT(DISTINCT LOWER(CONCAT(s.name, ':', s.value))) FROM Specification s " +
        "        WHERE s.product = p AND LOWER(CONCAT(s.name, ':', s.value)) IN :specs) >= :specCount)")
 Page<Product> searchProducts(
     @Param("name") String name,
     @Param("category") String category,
     @Param("color") String color,
     @Param("price_gte") Double priceGte,
     @Param("price_lte") Double priceLte,
     @Param("specs") List<String> specs,    // Ví dụ: ["type:over-ear", "type:in-ear"]
     @Param("specCount") Long specCount,      // Số lượng filter spec truyền xuống
     Pageable pageable
 );

    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(CAST(p.name AS string)) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%'))) " +
            "ORDER BY p.id ASC")
    List<Product> suggestProducts(@Param("name") String name);

    @Query("SELECT p FROM Product p WHERE p.id IN :productIds ORDER BY p.id ASC")
    List<Product> findProductsByListIds(@Param("productIds") List<String> productIds);

    @Query("SELECT p FROM Product p order by p.id asc")
    Page<Product> getProductForManagement(Pageable pageable);
}