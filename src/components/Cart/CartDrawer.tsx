
import { CartItem } from "../CartButton";

interface CartDrawerProps {
  cartItems: CartItem[];
  onClose: () => void;
}

const CartDrawer = ({ cartItems, onClose }: CartDrawerProps) => {
  return (
    <div className="cart-drawer-new">
      <div className="cart-header-new">
        <h2>Ostokori</h2>
        <button onClick={onClose} className="cart-close-new">✕</button>
      </div>
      <div className="cart-items-new">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item-new">
              <div className="cart-left-new">
                <div className="cart-name-new">{item.nameFi || item.nameEn}</div>
                {item.selectedSize && (
                  <div className="cart-size-new">{item.selectedSize}</div>
                )}
                {item.notes && (
                  <div className="cart-notes-new">{item.notes}</div>
                )}
              </div>
              <div className="cart-right-new">
                <div className="cart-price-new">{item.selectedPrice} €</div>
                <div className="cart-qty-new">x{item.quantity}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="cart-empty-new">Ostokori on tyhjä</div>
        )}
      </div>
      <div className="cart-footer-new">
        <button onClick={onClose} className="cart-close-btn-new">Sulje</button>
      </div>
    </div>
  );
};

export default CartDrawer;
