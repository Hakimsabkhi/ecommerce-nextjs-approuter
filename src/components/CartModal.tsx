import React from "react";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeItem, updateItemQuantity } from "../store/cartSlice";
import Pagination from "@/components/Pagination";

// Define the shape of the cart item
interface CartItem {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl?: string;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  quantity: number;
}

// Define the props the component expects
interface CartModalProps {
  items: CartItem[];
}

const CartModal: React.FC<CartModalProps> = React.memo(({ items }) => {
  const dispatch = useDispatch();

  // Calculate total quantity and total price once
  const totalQuantity = React.useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const totalPrice = React.useMemo(() => {
    return items.reduce((total, item) => {
      const finalPrice =
        item.discount != null && item.discount > 0
          ? item.price - (item.price * item.discount) / 100
          : item.price;
      return total + finalPrice * item.quantity;
    }, 0);
  }, [items]);

  const incrementHandler = (item: CartItem) => {
    if (item.quantity < item.stock) {
      dispatch(updateItemQuantity({ _id: item._id, quantity: item.quantity + 1 }));
    }
  };

  const decrementHandler = (item: CartItem) => {
    if (item.quantity > 1) {
      dispatch(updateItemQuantity({ _id: item._id, quantity: item.quantity - 1 }));
    }
  };

  const removeCartHandler = (_id: string) => dispatch(removeItem({ _id }));

  // Pagination state (example implementation)
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 4; // Adjust as necessary
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="absolute p-4 bg-white shadow-xl rounded-lg z-30 flex gap-2 flex-col top-12 right-0 w-[500px] max-md:w-[360px] border-[#15335D] border-[4px]">
      <div className="flex flex-col gap-4">
        {paginatedItems.length === 0 ? (
          <p className="text-center text-black">Your cart is empty.</p>
        ) : (
          paginatedItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between">
              <Image
                className="w-20 h-20 object-cover"
                src={item.imageUrl || "/path/to/default-image.jpg"}
                alt={item.name}
                width={80}
                height={80}
              />
              <div className="text-black flex-col flex gap-2">
                <p className="text-xl font-bold">{item.name}</p>
                <p className="text-gray-400 text-xs">Size: XXS</p>
                <p className="text-gray-400 text-xs">Quantity: {item.quantity}</p>
                <p className="text-gray-400 text-xs">
                  Price Unit: TND {(
                    item.price - (item.discount ? item.price * item.discount / 100 : 0)
                  ).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-black p-2 w-12 flex items-center justify-center bg-opacity-40 rounded-lg border-2 border-gray-400 bg-[#959595]"
                  onClick={() => decrementHandler(item)}
                >
                  -
                </button>
                <span className="text-black p-2 w-12 flex items-center justify-center bg-opacity-40 rounded-lg border-2 border-gray-400 bg-[#959595]">
                  {item.quantity}
                </span>
                <button
                  className="text-black p-2 w-12 flex items-center justify-center bg-opacity-40 rounded-lg border-2 border-gray-400 bg-[#959595]"
                  onClick={() => incrementHandler(item)}
                >
                  +
                </button>
                <FaRegTrashAlt
                  size={20}
                  className="text-black cursor-pointer"
                  onClick={() => removeCartHandler(item._id)}
                />
              </div>
            </div>
          ))
        )}
        <div className="flex justify-center mt-4 text-gray-500">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      {items.length > 0 && (
        <>
          <p className="text-gray-400 text-2xl flex items-center justify-center flex-col gap-4 mt-9">
            Total: TND {totalPrice.toFixed(2)}
          </p>
          <Link href="/checkout" passHref>
            <button
              aria-label="check"
              className="w-full h-10 rounded-lg bg-orange-400 hover:bg-[#15335D] flex items-center justify-center mt-4"
            >
              <p className="text-xl text-white">Checkout</p>
            </button>
          </Link>
          <p className="w-full text-center text-black underline mt-4 cursor-pointer">
            Continue shopping
          </p>
        </>
      )}
    </div>
  );
});

// Set displayName for better debugging
CartModal.displayName = "CartModal";

export default CartModal;
