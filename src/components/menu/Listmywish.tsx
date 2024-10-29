"use client";

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'; // Import Image from next/image
import { FaRegTrashAlt } from 'react-icons/fa';
import { AiOutlineHeart } from 'react-icons/ai';

interface ListmywishProps {
    data: Favorites[];
}

interface Favorites {
    _id: string;
    product: Product;
}

interface Product {
    _id: string;
    name: string;
    imageUrl: string;
    slug: string;
    category: { slug: string }; // Ensure category is defined
    price: number; // Ensure price is defined
    discount?: number; // Optional discount property
}

const Listmywish: React.FC<ListmywishProps> = ({ data: initialData }) => {
    const [isListVisible, setListVisible] = useState(false);
    const [wishlist, setWishlist] = useState(initialData);
    const listRef = useRef<HTMLDivElement>(null); // Ref for wishlist container
    const toggleListVisibility = () => {
        setListVisible(prev => !prev);
    };
   const handleLinkClick=()=>{
    setListVisible(false)
   }
    const handleDeleteFavorite = async (id: string) => {
        const response = await fetch(`/api/favorite/deleteFavorite/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            // Remove item from local state if deletion is successful
            setWishlist(prevWishlist => prevWishlist.filter(item => item._id !== id));
        } else {
            throw new Error("Failed to delete the product");
        }
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (listRef.current && !listRef.current.contains(event.target as Node)) {
                setListVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div onClick={toggleListVisibility} className="flex w-[200px] items-center justify-center gap-2 max-lg:w-fit text-white cursor-pointer select-none max-xl:hidden">
                <div className="relative my-auto mx-2">
                    <AiOutlineHeart size={40} className="text-white" />
                    <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
                        {wishlist?.length}
                    </span>
                </div>
                <div className="flex flex-col">
                    <p className="text-[#C1C4D6] text-sm">Favorite</p>
                    <p className="text-white font-bold max-md:hidden">My Wishlist</p>
                </div>
            </div>
            {/* Render the wishlist items based on visibility */}
            {isListVisible && (
                <div  ref={listRef} className="absolute flex flex-col px-4 w-[400px] max-md:w-[350px] max-h-64 overflow-y-auto border-[#15335D] border-4 rounded-lg bg-white z-30 right-52">
                    {wishlist.length > 0 ? (
                        <div>
                            {wishlist.map(item => {
                                const { product } = item;
                                return (
                                    <div key={product._id} className="flex items-center justify-between py-2 max-md:mx-[10%] border-b-2">
                                        <Link href={`/${product.category.slug}/${product.slug}`} onClick={handleLinkClick} className="grid grid-cols-4">
                                            <Image
                                                width={50}
                                                height={50}
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="rounded-md"
                                            />
                                            <span className="">{product.name}</span>
                                            {/* Product Price & Discount */}
                                            <span className="flex flex-col-2">
                                                {product.discount ? (
                                                    <>
                                                        {/* Show discounted price */}
                                                        <span className="line-through mr-2 text-red-500">
                                                            {product.price.toFixed(2)} TND
                                                        </span>
                                                        <span className="text-green-500">
                                                            {(
                                                                (product.price * (100 - product.discount)) /
                                                                100
                                                            ).toFixed(2)} TND
                                                        </span>
                                                    </>
                                                ) : (
                                                    // Show regular price if no discount
                                                    <span className='text-gray-400'>{product.price.toFixed(2)} TND</span>
                                                )}
                                            </span>
                                        </Link>
                                        <div>
                                            <button type="button" onClick={() => handleDeleteFavorite(item._id)} className="ml-4 text-gray-500">
                                                <FaRegTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500">No items in your wishlist.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Listmywish;
