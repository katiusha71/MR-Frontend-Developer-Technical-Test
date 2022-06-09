import Button from '@material-ui/core/Button';
// Types
import { CartItemType } from '../App';
// Styles
import { Wrapper } from './Item.styles';
import Grid from '@material-ui/core/Grid';

type Props = {
  item: CartItemType;
    handleAddToCart: (clickedItem: CartItemType) => void;
    handleChooseSize: (clickedItem: CartItemType) => void;
};



const Item: React.FC<Props> = ({ item, handleChooseSize, handleAddToCart  }) => (
    <Wrapper >
        <Grid spacing={1} container item xs={12}>
            <Grid item xs={12} sm={6} >
                    <img className="img_item" src={item.imageURL} alt={item.title} />
                </Grid>
            <Grid item xs={12} sm={6} >
                    <div>
                        <div id="title">{item.title}</div>
                        <h3 id="price">${item.price}.00</h3>
                        <p>{item.description}</p>
                </div>
                <div id="star"> * <div id="product_size">SIZE</div>  <div id="choosenSize">{item.label}</div> </div>
                <div className="hotspots">
                    {item.sizeOptions.map((item, j) => {
                        return <div className="pr_size" onClick={() => handleChooseSize(item)} style={{ border: item.style==="yes" ? '2px solid #222222' :  '1px solid #CCCCCC' }} key={j} >{item.label} </div>
                    })}
                </div>
                <div><Button className="click" onClick={() => handleAddToCart(item)}>Add to cart</Button></div>
             </Grid>
         </Grid>
    </Wrapper>
);

export default Item;
