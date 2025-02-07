const API = (() => {
    const URL = "http://localhost:3000";

    const getCart = () => {
        return fetch(`${URL}/cart`)
            .then(response => response.json());
    };

    const getInventory = () => {
        return fetch(`${URL}/inventory`)
            .then(response => response.json());
    };

    const addToCart = (inventoryItem) => {
        return getCart()
            .then(cart => cart.find(item => item.id === inventoryItem.id))
            .then(existingItem => {
                if (existingItem) {
                    existingItem.amount += inventoryItem.amount;
                    return fetch(`${URL}/cart/${inventoryItem.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(existingItem)
                    });
                } else {
                    return fetch(`${URL}/cart`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(inventoryItem)
                    });
                }
            })
            .then(response => response.json());
    };

    const updateCart = (id, newAmount) => {
        return getCart()
            .then(cart => cart.find(item => item.id === id))
            .then(item => {
                if (item) {
                    item.amount = newAmount;
                    return fetch(`${URL}/cart/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    });
                }
            })
            .then(response => response.json());
    };

    const deleteFromCart = (id) => {
        return fetch(`${URL}/cart/${id}`, { 
            method: 'DELETE' 
        });
    };

    const checkout = () => {
        return getCart()
            .then((data) => Promise.all(data.map((item) => deleteFromCart(item.id))));
    };

    return {
        getCart,
        updateCart,
        getInventory,
        addToCart,
        deleteFromCart,
        checkout,
    };
})();

export class Model {
    constructor() {
        this.inventory = [];
        this.cart = [];
    }

    fetchInventory() {
        return API.getInventory()
            .then(inventory => {
                this.inventory = inventory;
                return this.inventory;
            });
    }

    fetchCart() {
        return API.getCart()
            .then(cart => {
                this.cart = cart;
                return this.cart;
            });
    }

    addToCart(item, amount) {
        const cartItem = { ...item, amount };
        return API.addToCart(cartItem)
            .then(() => API.getCart())
            .then(cart => {
                this.cart = cart;
            });
    }

    updateCartItem(id, amount) {
        return API.updateCart(id, amount)
            .then(() => API.getCart())
            .then(cart => {
                this.cart = cart;
            });
    }

    deleteCartItem(id) {
        return API.deleteFromCart(id)
            .then(() => API.getCart())
            .then(cart => {
                this.cart = cart;
            });
    }

    checkout() {
        return API.checkout()
            .then(() => {
                this.cart = [];
            });
    }
} 