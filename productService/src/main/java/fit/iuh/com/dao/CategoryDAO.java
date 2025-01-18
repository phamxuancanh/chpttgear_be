package fit.iuh.com.dao;

import fit.iuh.com.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CategoryDAO extends JpaRepository<Category, UUID> {

}
