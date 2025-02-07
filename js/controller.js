export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        Promise.all([
            this.model.fetchInventory(),
            this.model.fetchCart()
        ]).then(() => {
            this.view.renderInventory(this.model.inventory, {
                onAddToCart: (item, amount) => {
                    this.model.addToCart(item, amount)
                        .then(() => {
                            this.view.renderCart(this.model.cart, this.getCartHandlers());
                        });
                }
            });

            this.view.renderCart(this.model.cart, this.getCartHandlers());
            
            this.view.bindCheckout(() => {
                this.model.checkout()
                    .then(() => {
                        this.view.renderCart(this.model.cart, this.getCartHandlers());
                    });
            });
        });
    }

    getCartHandlers() {
        return {
            onDelete: (id) => {
                this.model.deleteCartItem(id)
                    .then(() => {
                        this.view.renderCart(this.model.cart, this.getCartHandlers());
                    });
            },
            onUpdate: (id, amount) => {
                this.model.updateCartItem(id, amount)
                    .then(() => {
                        this.view.renderCart(this.model.cart, this.getCartHandlers());
                    });
            }
        };
    }
} 