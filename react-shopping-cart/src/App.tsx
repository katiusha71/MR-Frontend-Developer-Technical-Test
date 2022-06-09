import { useState } from 'react';
import { useQuery } from 'react-query';
// Components
import Item from './Item/Item';
import Cart from './Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';

// Styles
import { Wrapper, StyledButton } from './App.styles';
// Types
export type CartItemType = {
    id: number;
    category: string;
    description: string;
    imageURL: string;
    price: number;
    title: string;
    sizeOptions: CartItemType[];
    label: string;
    amount: number;
    style: string
};



const getProducts = async (): Promise<CartItemType[]> =>
    //await (await fetch('https://fakestoreapi.com/products')).json();
   // await (await fetch('https://drive.google.com/file/d/0B8KYnbdnrRGXSXVoMzdqRWhCTXc/view?resourcekey=0-isJkYanmVCSmONHLETXDwg')).json();
    await (await fetch('http://localhost:3001/ProductData.json')).json();

const App = () => {
    const [sizeChoosen, setsizeChoosen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([] as CartItemType[]);
    const { data, isLoading, error } = useQuery<CartItemType[]>(
        'products',
        getProducts
    );

    console.log(data);
    const getTotalItems = (items: CartItemType[]) =>
        items.reduce((ack: number, item) => ack + item.amount, 0);


    const handleChooseSize = (clickedItem: CartItemType) => {
        data?.map(item => {
            item.label = clickedItem.label
            item.sizeOptions.map((item) => {
                item.id === clickedItem.id
                    ? clickedItem.style = "yes" 
                    : item.style = "no"
            })
                sizeChoosen
                    ? setsizeChoosen(false)
                    : setsizeChoosen(true)
        });
    };
    const handleAddToCart = (clickedItem: CartItemType) => {
        console.log(clickedItem.label);
        if (clickedItem.label === undefined) return alert(' Choose a size, please!'); 
        setCartItems(prev => {
            // 1. Is the item already added in the cart?
            const isItemInCart = prev.find(item => item.label === clickedItem.label);

            if (isItemInCart) {
                return prev.map(item =>
                    item.label === clickedItem.label
                        ? { ...item, amount: item.amount + 1 }
                        : item
                );
            }
            // First time the item is added
            return [...prev, { ...clickedItem, amount: 1 }];
        });
    };

    const handleRemoveFromCart = (label: string) => {
        setCartItems(prev =>
            prev.reduce((ack, item) => {
                if (item.label === label) {
                    if (item.amount === 1) return ack;
                    return [...ack, { ...item, amount: item.amount - 1 }];
                } else {
                    return [...ack, item];
                }
            }, [] as CartItemType[])
        );
    };




    if (isLoading) return <LinearProgress />;
    if (error) return <div>Something went wrong ...</div>;

    return (
        <Wrapper>
            <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
                <Cart
                    cartItems={cartItems}
                    addToCart={handleAddToCart}
                    removeFromCart={handleRemoveFromCart}
                />
            </Drawer>
            <StyledButton onClick={() => setCartOpen(true)}>
                <Badge badgeContent={getTotalItems(cartItems)} color='error'>
                    <AddShoppingCartIcon />
                </Badge>
            </StyledButton>
            <Grid container spacing={2} justifyContent="center">
                {data?.map(item => (
                    <Grid item key={item.id} xs={12} sm={8}>
                        <Item item={item} handleChooseSize={handleChooseSize} handleAddToCart={handleAddToCart} />
                    </Grid>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default App;
