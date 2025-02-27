package fit.iuh.com.controller;

import fit.iuh.com.model.Cart;
import fit.iuh.com.model.CartItem;
import fit.iuh.com.service.CartItemService;
import fit.iuh.com.service.CartService;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class CartItemController {
    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    @GetMapping("/carts/cart_items/findAllCartItems")
    public ResponseEntity<List<CartItem>> getAllCartItem() {
        List<CartItem> list = cartItemService.getAllCartItems();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/carts/cart_items/findByCartId/{cartId}")
    public ResponseEntity<List<CartItem>> getCartItemsByCartId(@PathVariable("cartId") UUID cartId) {
        List<CartItem> list = cartItemService.getCartItemsByCartId(cartId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/carts/cart_items/findByCartItemId/{cartItemId}")
    public ResponseEntity<CartItem> getCartItemById(@PathVariable("cartItemId") UUID cartItemId) {
        CartItem cartItem = cartItemService.getById(cartItemId);
        if (cartItem == null) {
            return null;
        }
        return ResponseEntity.ok(cartItem);
    }

    @PostMapping("/carts/cart_items/createCartItems")
    public ResponseEntity<CartItem> createCartItem(@RequestBody CartItem cartItem) {
        CartItem newCartItem = cartItemService.createCartItem(cartItem);
        return ResponseEntity.status(HttpStatus.CREATED).allow(HttpMethod.POST).body(newCartItem);
    }

    @PutMapping("/carts/cart_items/updateQuantityByCartItemId/{cartItemId}")
    public ResponseEntity<CartItem> updateQuantityByCartItemId(@RequestBody String quantity, @PathVariable("cartItemId") UUID cartItemId) {
        CartItem cartItem = cartItemService.getById(cartItemId);
        if (cartItem == null) {
            return null;
        }
        cartItem.setQuantity(Integer.parseInt(quantity));
        return ResponseEntity.ok(cartItem);
    }


    @PutMapping("/carts/cart_items/updateCartItem/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItem(@RequestBody CartItem cartItem, @PathVariable("cartItemId") UUID id) {
        int maxQuantity = 1000;
        if (cartItem.getQuantity() < 0 && cartItem.getQuantity() > maxQuantity) {
            return null;
        }
        return ResponseEntity.ok(cartItemService.updateCartItem(cartItem, id));
    }

    @DeleteMapping("/carts/cart_items/deleteByCartItemId/{cartItemId}")
    public ResponseEntity<CartItem> deleteCartItem(@PathVariable("cartItemId") UUID cartItemId) {
        return ResponseEntity.ok(cartItemService.deleteCartItem(cartItemId));
    }
}
