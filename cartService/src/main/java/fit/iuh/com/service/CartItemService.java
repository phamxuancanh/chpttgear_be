package fit.iuh.com.service;

import fit.iuh.com.model.CartItem;
import fit.iuh.com.repository.CartItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CartItemService {
    private CartItemRepository cartItemRepository;

    public CartItemService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public List<CartItem> getAll() {
        return cartItemRepository.findAll();
    }

    public CartItem getById(UUID id) {
        return cartItemRepository.findById(id).orElse(null);
    }

    public CartItem createOne(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateOne(CartItem cartItem, UUID id) {
        if (cartItemRepository.findById(id).isPresent()) {
            return cartItemRepository.save(cartItem);
        }
        return null;
    }

    public CartItem deleteOne(UUID id) {
        CartItem cartItem = cartItemRepository.findById(id).orElse(null);
        if (cartItem != null) {
            cartItemRepository.delete(cartItem);
        }
        return cartItem;
    }
}
