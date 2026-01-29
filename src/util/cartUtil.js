export const calculateSubtotal = (cartItems = [], quantities = {}) => {

    const subtotal = cartItems.reduce((acc, item) => {
        const qty = quantities[item.id] || 0;
        return acc + item.price * qty;
    }, 0);

    const shipping = subtotal > 0 ? 10 : 0;
    const tax = +(subtotal * 0.1).toFixed(2); // 10% tax
    const total = +(subtotal + shipping + tax).toFixed(2);

    return {
        subtotal: +subtotal.toFixed(2),
        shipping,
        tax,
        total,
    };
};