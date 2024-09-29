// components/FilterComponent.tsx
import React, { ChangeEvent, useState } from 'react';
import Slider from 'react-slider';
import { AiOutlineClose } from 'react-icons/ai';
import Image from 'next/image';


interface FilterProps {
  values: [number, number];
  selectedBrand: string;
  selectedColor: string;
  selectedStatus: string;
  selectedMaterials: string[];
  onPriceChange: (newValues: [number, number]) => void;
  onBrandChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onColorChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBrandClick: (brand: string) => void;
  onColorClick: (color: string) => void;
  onStatusClick: (status: string) => void;
  onMaterialClick: (material: string) => void;
  brands: string[];
  colors: string[];
  statuses: string[];
  materials: string[];
  products: ProductData[];
  menuOpen: boolean;
  handleNav: () => void;
}

interface ProductData {
  brand?: { name: string };
  color?: string;
  material?: string;
  status?: string;
  price: number;
}

const FilterComponent: React.FC<FilterProps> = ({
  values,
  selectedBrand,
  selectedColor,
  selectedStatus,
  selectedMaterials,
  onPriceChange,
  onBrandChange,
  onColorChange,
  onBrandClick,
  onColorClick,
  onStatusClick,
  onMaterialClick,
  brands,
  colors,
  statuses,
  materials,
  products,
  menuOpen,
  handleNav
}) => {
  return (
    <div >
      <div className='max-lg:hidden '>
        <div className="flex-col gap-4 flex container w-full rounded-lg px-10 py-8 max-lg:hidden">
          {/* Filter By Price */}
          <p className="font-bold">Filter By Price</p>
          <Slider
            className="slider"
            onChange={onPriceChange}
            value={values}
            min={1}
            max={500}
            renderThumb={(props, state) => (
              <div {...props} aria-label={`Price thumb ${state.index + 1}`}>
                {/* You can customize the thumb appearance here if needed */}
              </div>
            )}
          />

          <div className="flex justify-between">
            <div className="flex items-center">
              <p className="text-xs text-[#525566]">Price:</p>
              <p className="text-xs">
                {values[0]} TND - {values[1]} TND
              </p>
            </div>
            <p className="bg-primary cursor-pointer rounded-full text-white text-xs px-4 py-1">
              filter
            </p>
          </div>
          {/* Filter By Brand */}
          <p className="font-bold">Filter By Brand</p>
          <input
            className="px-2 py-1 rounded-full border border-gray-300"
            type="text"
            placeholder="Find a Brand"
            value={selectedBrand}
            onChange={onBrandChange}
          />
          <div className="flex flex-col gap-2">
            {brands.map((brand) => (
              <div
                key={brand}
                className="flex w-full justify-between items-center"
                onClick={() => onBrandClick(brand)}
              >
                <p className="text-[#525566] cursor-pointer">{brand}</p>
                <div>
                  <p className="ring-1 ring-[#525566] rounded-full px-4 py-1 cursor-pointer">
                    {
                      products.filter(
                        (item) =>
                          item.brand?.name.toLowerCase() === brand.toLowerCase()
                      ).length
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Filter By Color */}
          <p className="font-bold">Color</p>
          <input
            className="px-2 py-1 rounded-full border border-gray-300"
            type="text"
            placeholder="Find a Color"
            value={selectedColor}
            onChange={onColorChange}
          />
          <div className="flex flex-col gap-2">
            {colors.map((color) => (
              <div
                key={color}
                className="flex w-full justify-between items-center"
                onClick={() => onColorClick(color)}
              >
                <p className="text-[#525566] cursor-pointer">{color}</p>
                <div>
                  <p className="ring-1 ring-[#525566] rounded-full px-4 py-1 cursor-pointer">
                    {
                      products.filter(
                        (item) =>
                          item.color?.toLowerCase() === color.toLowerCase()
                      ).length
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Filter By Status */}
          <p className="font-bold">Product status</p>
          <div className="flex flex-col gap-2">
            {statuses.map((status, index) => (
              <div key={index} className="flex items-center gap-2 ">
                <input
                  id={status}
                  type="checkbox"
                  className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={selectedStatus === status}
                  onChange={() => onStatusClick(status)}
                />
                <label htmlFor={status} className="text-[#525566] dark:text-gray-300">
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* mobile */}
      {menuOpen && (
        <div onClick={handleNav} className="fixed inset-0 bg-black opacity-50 z-40"></div>
      )}
      <div
        className={
          menuOpen
            ? "fixed z-50 left-0 top-0 w-[80%] lg:hidden h-screen bg-[#ecf3ec] ease-in duration-300"
            : "fixed z-50 left-[-100%] top-0 h-screen ease-in duration-300"
        }
      >
        <div
          onClick={handleNav}
          className="fixed flex pr-4 justify-end bg-white h-20 border-b-2 w-[80%] items-center z-40"
        >
          <div className="flex items-center">
            <AiOutlineClose size={20} />
            <p>Close</p>
          </div>
        </div>
        <div className="flex overflow-y-auto flex-col w-full gap-4 h-full pb-10 pt-16">
          <div className="flex-col gap-4 flex bg-white container w-full rounded-lg px-10 py-8">
            <p className="font-bold">Filter By Price</p>
            <Slider
              className="slider"
              onChange={onPriceChange}
              value={values}
              min={1}
              max={500}
              renderThumb={(props, state) => (
                <div {...props} aria-label={`Price thumb ${state.index + 1}`}>
                  {/* You can customize the thumb appearance here if needed */}
                </div>
              )}
            />
            <div className="flex justify-between">
              <div className="flex items-center">
                <p className="text-xs text-[#525566]">Price:</p>
                <p className="text-xs">
                  {values[0]} TND - {values[1]} TND
                </p>
              </div>
              <p className="bg-orange-400 cursor-pointer rounded-full text-white text-xs px-4 py-1">
                filter
              </p>
            </div>
            <div>
              <p className="font-bold">Filter By Brand</p>
            </div>
            <div className="w-full">
              <input
                className="px-2 py-1 rounded-full border border-gray-300"
                type="text"
                placeholder="Find a Brand"
                value={selectedBrand}
                onChange={onBrandChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className="flex w-full justify-between items-center"
                  onClick={() => onBrandClick(brand)}
                >
                  <p className="text-[#525566] cursor-pointer">{brand}</p>
                  <div>
                    <p className="ring-1 ring-[#525566] rounded-full px-4 py-1 cursor-pointer">
                      {products.filter(
                        (item) =>
                          item.brand?.name.toLowerCase() ===
                          brand.toLowerCase()
                      ).length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold">Color</p>
            </div>
            <div className="w-full">
              <input
                className="px-2 py-1 rounded-full border border-gray-300"
                type="text"
                placeholder="Find a Color"
                value={selectedColor}
                onChange={onColorChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className="flex w-full justify-between items-center"
                  onClick={() => onColorClick(color)}
                >
                  <p className="text-[#525566] cursor-pointer">{color}</p>
                  <div>
                    <p className="ring-1 ring-[#525566] rounded-full px-4 py-1 cursor-pointer">
                      {products.filter(
                        (item) =>
                          item.color?.toLowerCase() === color.toLowerCase()
                      ).length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold">Product status</p>
            </div>
            <div className="flex flex-col gap-2">
              {statuses.map((status, index) => (
                <div key={index} className="flex items-center gap-2 ">
                  <input
                    id={status}
                    type="checkbox"
                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={selectedStatus === status}
                    onChange={() => onStatusClick(status)}
                  />
                  <label
                    htmlFor={status}
                    className="text-[#525566] dark:text-gray-300"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
