package fit.iuh.com.service;

import fit.iuh.com.model.Cart;
import fit.iuh.com.model.CartItem;
import fit.iuh.com.repository.CartItemRepository;
import fit.iuh.com.repository.CartRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CartItemService {
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;

    public CartItemService(CartItemRepository cartItemRepository, CartRepository cartRepository) {
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
    }

    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    public List<CartItem> getCartItemsByCartId(UUID cartId) {
        cartRepository.findById(cartId).orElseThrow(() ->
                new RuntimeException("Cart not found"));
        List<CartItem> list = cartItemRepository.findCartItemsByCart_Id(cartId);
        list.forEach(System.out::println);
        return list;
    }

    public CartItem getById(UUID cartItemId) {
        return cartItemRepository.findById(cartItemId).orElse(null);
    }

    public CartItem createCartItem(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateCartItem(CartItem cartItem, UUID cartItemId) {
        if (!cartItemRepository.findById(cartItemId).isPresent()) {
            return null;
        }
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateQuantityByCartItemId(int quantity, UUID cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId).orElseThrow(() ->
                new RuntimeException("Not found"));
        if (cartItem != null) {
            cartItem.setQuantity(quantity);
        }
        return cartItem;
    }

    public CartItem deleteCartItem(UUID cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId).orElseThrow(() ->
                new RuntimeException("Not found") );
        if (cartItem != null) {
            cartItemRepository.delete(cartItem);
        }
        return cartItem;
    }
}
