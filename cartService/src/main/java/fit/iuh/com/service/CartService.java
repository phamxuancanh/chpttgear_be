package fit.iuh.com.service;

import fit.iuh.com.model.Cart;
import fit.iuh.com.repository.CartRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CartService {
    private CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public List<Cart> getAll() {
        return cartRepository.findAll();
    }

    public Cart getOneById(UUID id) {
        return cartRepository.findById(id).orElse(null);
    }

    public Cart createOne(Cart cart) {
        return cartRepository.save(cart);
    }

    public Cart updateOne(Cart cart, UUID id) {
        if (cartRepository.findById(id).isPresent()) {
            return cartRepository.save(cart);
        }
        return null;
    }
}
