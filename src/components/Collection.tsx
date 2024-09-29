
import React from 'react';
import Image  from 'next/image';
import { collectionlogo } from "@/assets/image";
import { collection } from '@/assets/data';



const Collection = () => {
    return (
        <div className="flex flex-col justify-center items-center py-8 gap-10">
            <div className="col-span-full flex flex-col items-center gap-2">
                <h2 className="font-bold text-4xl">Product Collection</h2>
                <p className="text-base text-[#525566]">Explore product collections from our vendors</p>
            </div>
            <div className="grid grid-cols-5 max-xl:grid-cols-2 max-md:grid-cols-1 justify-center items-center gap-8">
                {collection.map((item, index) => (
                    <div key={index} className='relative w-full h-full overflow-hidden group'>
                        <div className='w-full h-full bg-black/60 absolute rounded-lg opacity-0 max-lg:opacity-50 lg:group-hover:opacity-80 lg:group-hover:backdrop-blur-sm duration-500'></div>
                        <Image 
                            src={item.src} 
                            alt={item.name} 
                            width={300} // Set appropriate width
                            height={200} // Set appropriate height
                            priority={index === 0} // Eagerly load the first image
                        />
                        <div className="absolute w-full top-[-100%] max-lg:top-[30%] lg:group-hover:top-[40%] duration-500 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col text-center items-center gap-8">
                            <Image 
                                className='max-lg:w-20 max-lg:h-20' 
                                src={collectionlogo} 
                                alt="logo" 
                                width={80} // Set appropriate width
                                height={80} // Set appropriate height
                            />
                            <p className="text-xl max-lg:text-xs max-md:text-xl font-bold text-white">{item.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Collection;
