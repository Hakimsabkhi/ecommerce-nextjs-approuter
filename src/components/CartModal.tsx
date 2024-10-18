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
      dispatch(
        updateItemQuantity({ _id: item._id, quantity: item.quantity + 1 })
      );
    }
  };

  const decrementHandler = (item: CartItem) => {
    if (item.quantity > 1) {
      dispatch(
        updateItemQuantity({ _id: item._id, quantity: item.quantity - 1 })
      );
    }
  };

  const removeCartHandler = (_id: string) => dispatch(removeItem({ _id }));

  // Pagination state (example implementation)
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 4; // Adjust as necessary
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className=" p-4 w-[450px] max-md:w-full  border-[#15335D] border-[4px] rounded-lg bg-white">
        <h1 className="text-xl font-bold text-black border-b-2 text-center py-2">You shopping cart ({items.length} items)</h1>
      <div className="flex flex-col gap-2">
        {paginatedItems.length === 0 ? (
          <p className="text-center text-black">Your cart is empty.</p>
        ) : (
          paginatedItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between py-2 border-b-2"
            >
              <Image
                className="w-20 h-20 object-cover"
                src={item.imageUrl || "/path/to/default-image.jpg"}
                alt={item.name}
                width={80}
                height={80}
              />
              <div className="text-black flex-col flex gap-2">
                <p className="text-sm font-bold">{item.name}</p>
                <p className="text-gray-800 text-xs">
                  Quantity: {item.quantity}
                </p>
                <p className="text-gray-800 text-xs max-md:hidden">
                  Price Unit: TND{" "}
                  {(
                    item.price -
                    (item.discount ? (item.price * item.discount) / 100 : 0)
                  ).toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 max-md:hidden">
                  <button
                    className="text-black w-8 h-8 flex items-center justify-center bg-opacity-40 rounded-lg border-2 border-[#15335E] bg-white"
                    onClick={() => decrementHandler(item)}
                  >
                    -
                  </button>
                  <span className="text-black h-8 w-6 flex items-center justify-center bg-opacity-40 bg-white">
                    {item.quantity}
                  </span>
                  <button
                    className="text-black w-8 h-8 flex items-center justify-center bg-opacity-40 rounded-lg border-2 border-[#15335E] bg-white"
                    onClick={() => incrementHandler(item)}
                  >
                    +
                  </button>
                </div>
                <button
  className="flex gap-2 items-center justify-center text-black cursor-pointer"
  onClick={() => removeCartHandler(item._id)}
>
  <span className="max-md:hidden">Remove</span>
  <FaRegTrashAlt size={20} />
</button>
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
          <p className="text-black text-2xl font-bold flex items-center justify-center flex-col gap-4">
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
