import { useReducer, createContext } from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products.js';

export const CartContext = createContext({
    items: [],
    addItemToCart: () => {},
    updateItemQuantity: () => {},
});

function shoppingCartReducer(prevState, action) {
    if (action.type === 'ADD_ITEM') {
        const updatedItems = [...prevState.items];
        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
            updatedItems.push({
                id: action.payload,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        return {
            items: updatedItems,
        };
    }

    if (action.type === 'UPDATE_ITEM') {
        const updatedItems = [...prevState.items];
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
        );
        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.payload.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            items: updatedItems,
        };
    }

    return prevState;
}

export default function CartContextProvider({children}) {
    const [shoppingCart, setShoppingCartDispatch] = useReducer(
        shoppingCartReducer,
        {
            items: []
        }
    );

    const ctxValue = {
        items: shoppingCart.items,
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity
    }

    function handleAddItemToCart(id) {
        setShoppingCartDispatch({
            type: 'ADD_ITEM',
            payload: id
        });
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        setShoppingCartDispatch({
            type: 'UPDATE_ITEM',
            payload: {
                productId,
                amount
            }
        });
    }

    return (
        <CartContext.Provider value={ctxValue}>
            {children}
        </CartContext.Provider>
    )
}