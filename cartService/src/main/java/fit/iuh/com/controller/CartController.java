package fit.iuh.com.controller;

import fit.iuh.com.model.Cart;
import fit.iuh.com.model.CartItem;
import fit.iuh.com.service.CartItemService;
import fit.iuh.com.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class CartController {
    private final CartService cartService;
    private final CartItemService cartItemService;

    public CartController(CartService cartService, CartItemService cartItemService) {
        this.cartService = cartService;
        this.cartItemService = cartItemService;
    }

    /**
     * GET
     */
    // GET ALL

    @GetMapping("/carts")
    public List<Cart> getAllCart () {
        return cartService.getAll();
    }

    @GetMapping("/cart_items")
    public List<CartItem> getAllCartItem() {
        return cartItemService.getAll();
    }

    // GET BY ID

    @GetMapping("/carts/{id}")
    public Cart getCart (@PathVariable UUID id) {
        Cart cart = cartService.getById(id);
        if (cart == null) {
            return null;
        } else {
            return cart;
        }
    }

    @GetMapping("/cart_items/{id}")
    public CartItem getCartItemById(@PathVariable UUID id) {
        CartItem cartItem = cartItemService.getById(id);
        if (cartItem == null) {
            return null;
        } else {
            return cartItem;
        }
    }

    /**
     * POST
     */
    // CREATE

    @PostMapping("/carts")
    public Cart createCart(@RequestBody Cart cart) {
        return cartService.createOne(cart);
    }

    @PostMapping("/cart_items")
    public CartItem createCartItem(@RequestBody CartItem cartItem) {
        return cartItemService.createOne(cartItem);
    }

    // UPDATE
    @PutMapping("/carts/{id}")
    public Cart updateCart(@RequestBody Cart cart, @PathVariable UUID id) {
        return cartService.updateOne(cart, id);
    }

    @PutMapping("/cart_items/{id}")
    public CartItem updateCartItem(@RequestBody CartItem cartItem, @PathVariable UUID id) {
        return cartItemService.updateOne(cartItem, id);
    }

    // DELETE
    @DeleteMapping("/carts/{id}")
    public Cart deleteCart(@PathVariable UUID id) {
        return cartService.deleteOne(id);
    }

    @DeleteMapping("/cart_items/{id}")
    public CartItem deleteCartItem(@PathVariable UUID id) {
        return cartItemService.deleteOne(id);
    }
}
