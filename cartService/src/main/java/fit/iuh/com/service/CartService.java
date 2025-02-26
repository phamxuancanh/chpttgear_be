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
    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    public Cart getById(UUID cartId) {
        return cartRepository.findById(cartId).orElse(null);
    }

    public Cart getCartByUserId(UUID userId) {
        Cart cart = cartRepository.findCartByUserId(userId);
        if (cart == null) {
            cart = new Cart();
        }
        return cart;
    }

    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public Cart updateCart(Cart cart, UUID cartId) {
        if (cartRepository.findById(cartId).isPresent()) {
            return cartRepository.save(cart);
        }
        return null;
    }

    public Cart deleteCart(UUID cartId) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        if (cart != null) {
            cartRepository.delete(cart);
        }
        return cart;
    }
}
