//package fit.iuh.com.seeder;
//
//import com.fasterxml.jackson.core.type.TypeReference;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import fit.iuh.com.dao.CategoryDAO;
//import fit.iuh.com.dao.ProductDAO;
//import fit.iuh.com.model.Category;
//import fit.iuh.com.model.Product;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//import java.util.UUID;
//
//@Component
//public class ProductSeeder implements CommandLineRunner {
//    private final ProductDAO productDAO;
//    private final CategoryDAO categoryDAO;
//    private final ObjectMapper objectMapper;
//
//    public ProductSeeder(ProductDAO productDAO, CategoryDAO categoryDAO, ObjectMapper objectMapper) {
//        this.productDAO = productDAO;
//        this.categoryDAO = categoryDAO;
//        this.objectMapper = objectMapper;
//    }
//
//    @Override
//    public void run(String... args) {
//        seedCategories();
//        seedProducts();
//    }
//
//    @Transactional
//    public void seedCategories() {
//        if (categoryDAO.count() == 0) {
//            try {
//                // Đọc file JSON danh mục
//                String json = new String(Files.readAllBytes(new ClassPathResource("data/categories.json").getFile().toPath()));
//                System.out.println("Original JSON: " + json);
//
//                // Chuyển đổi JSON thành danh sách các đối tượng JSON
//                List<Map<String, Object>> categoriesList = objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
//                System.out.println("List: " + categoriesList);
//
//                // Sửa lỗi UUID trong dữ liệu JSON (nếu có)
//                categoriesList.forEach(category -> {
//                    String id = (String) category.get("id");
//                    if (id != null && !id.trim().isEmpty()) {
//                        // Kiểm tra và sửa UUID nếu cần
//                        if (isValidUUID(id)) {
//                            category.put("id", UUID.fromString(id)); // Chuyển đổi sang UUID đúng
//                        } else {
//                            System.err.println("❌ UUID không hợp lệ cho Category với ID: " + id);
//                        }
//                    }
//                });
//
//                // Chuyển đổi dữ liệu JSON đã sửa thành danh sách Category
//                List<Category> categories = objectMapper.convertValue(categoriesList, new TypeReference<List<Category>>() {});
//
//                System.out.println("Categories after processing: " + categories);
//
//                // Kiểm tra và lưu dữ liệu vào DB
//                categories.forEach(category -> {
//                    if (category.getId() == null || category.getId().toString().trim().isEmpty()) {
//                        System.err.println("❌ ID không hợp lệ cho Category: " + category.getName());
//                    } else {
//                        // Kiểm tra xem ID đã tồn tại chưa, nếu chưa tồn tại thì lưu vào DB
//                        Optional<Category> existingCategory = categoryDAO.findById(category.getId());
//                        if (existingCategory.isEmpty()) {
//                            // Kiểm tra giá trị UUID trước khi lưu
//                            if (isValidUUID(category.getId().toString())) {
//                                categoryDAO.save(category);
//                                System.out.println("✅ Đã thêm Category với ID: " + category.getId());
//                            } else {
//                                System.err.println("❌ UUID không hợp lệ cho Category: " + category.getName());
//                            }
//                        } else {
//                            System.out.println("⚡ Category với ID " + category.getId() + " đã tồn tại.");
//                        }
//                    }
//                });
//
//                System.out.println("✅ Đã seed dữ liệu danh mục từ JSON thành công!");
//            } catch (IOException e) {
//                System.err.println("❌ Lỗi khi đọc file JSON danh mục: " + e.getMessage());
//            }
//        } else {
//            System.out.println("⚡ Dữ liệu danh mục đã tồn tại. Bỏ qua việc seed.");
//        }
//    }
//
//    private boolean isValidUUID(String uuid) {
//        try {
//            UUID.fromString(uuid);
//            return true;
//        } catch (IllegalArgumentException e) {
//            return false;
//        }
//    }
//
//
//    private void seedProducts() {
//        if (productDAO.count() == 0) {
//            try {
//                // Đọc file JSON sản phẩm
//                String json = new String(Files.readAllBytes(new ClassPathResource("data/products.json").getFile().toPath()));
//                List<Product> products = objectMapper.readValue(json, new TypeReference<List<Product>>() {});
//
//                // Kiểm tra ID hợp lệ và lưu dữ liệu
//                products.forEach(product -> {
//                    if (product.getId() == null || product.getId().toString().trim().isEmpty()) {
//                        System.err.println("❌ ID không hợp lệ cho Product: " + product.getName());
//                    } else {
//                        // Kiểm tra xem ID đã tồn tại chưa, nếu chưa tồn tại thì lưu vào DB
//                        if (productDAO.findById(product.getId()).isEmpty()) {
//                            productDAO.save(product);
//                            System.out.println("✅ Đã thêm Product với ID: " + product.getId());
//                        } else {
//                            System.out.println("⚡ Product với ID " + product.getId() + " đã tồn tại.");
//                        }
//                    }
//                });
//                System.out.println("✅ Đã seed dữ liệu sản phẩm từ JSON thành công!");
//            } catch (IOException e) {
//                System.err.println("❌ Lỗi khi đọc file JSON sản phẩm: " + e.getMessage());
//            }
//        } else {
//            System.out.println("⚡ Dữ liệu sản phẩm đã tồn tại. Bỏ qua việc seed.");
//        }
//    }
//
//}
