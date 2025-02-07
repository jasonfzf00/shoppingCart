export class View {
    constructor() {
        this.inventoryList = document.getElementById('inventory-list');
        this.cartList = document.getElementById('cart-list');
        this.checkoutBtn = document.getElementById('checkout-btn');
    }

    renderInventory(inventory, handlers) {
        this.inventoryList.innerHTML = '';
        inventory.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.innerHTML = `
                <div class="item-container">
                    <p>${item.content}</p>
                    <button class="decrease">-</button>
                    <span class="amount">0</span>
                    <button class="increase">+</button>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            `;

            let amount = 0;
            
            itemElement.querySelector('.decrease').addEventListener('click', () => {
                amount = Math.max(0, amount - 1);
                itemElement.querySelector('.amount').textContent = amount;
            });

            itemElement.querySelector('.increase').addEventListener('click', () => {
                amount++;
                itemElement.querySelector('.amount').textContent = amount;
            });

            itemElement.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                if (amount > 0) {
                    handlers.onAddToCart(item, amount);
                    amount = 0;
                    itemElement.querySelector('.amount').textContent = amount;
                }
            });

            this.inventoryList.appendChild(itemElement);
        });
    }

    renderCart(cart, handlers) {
        this.cartList.innerHTML = '';
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.innerHTML = `
                <div class="item-container">
                    <p>${item.content} x ${item.amount}</p>
                    <button class="delete-btn">Delete</button>
                    <button class="edit-btn">Edit</button>
                </div>
            `;

            itemElement.querySelector('.delete-btn').addEventListener('click', () => {
                handlers.onDelete(item.id);
            });

            itemElement.querySelector('.edit-btn').addEventListener('click', () => {
                this.showEditControls(itemElement, item, handlers);
            });

            this.cartList.appendChild(itemElement);
        });
    }

    showEditControls(itemElement, item, handlers) {
        let currentAmount = item.amount;
        const controls = itemElement.querySelector('.item-container');
        controls.innerHTML = `
            <div class="item-container">
                <span>${item.content}</span>
                <button class="decrease">-</button>
                <span class="amount">${item.amount}</span>
                <button class="increase">+</button>
                <button class="save">Save</button>
            </div>
        `;

        controls.querySelector('.decrease').addEventListener('click', () => {
            // Do nothing when currentAmount===0
            currentAmount = Math.max(0, currentAmount - 1);
            controls.querySelector('.amount').textContent = currentAmount;
        });

        controls.querySelector('.increase').addEventListener('click', () => {
            currentAmount++;
            controls.querySelector('.amount').textContent = currentAmount;
        });

        controls.querySelector('.save').addEventListener('click', () => {
            handlers.onUpdate(item.id, currentAmount);
        });
    }

    bindCheckout(handler) {
        this.checkoutBtn.addEventListener('click', handler);
    }
} 