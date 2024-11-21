import React from 'react';

interface InvoiceItem {
  refproduct: string;
  product: string;
  name: string;
  tva: number;
  quantity: number;
  image: string;
  discount: number;
  price: number;
}

interface InvoiceTableProps {
  items: InvoiceItem[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ items }) => {
  // Calculate total amount, including discount and TVA
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const discountedPrice = item.price - (item.price * (item.discount / 100)); // Apply discount
     
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  return (
    <div className="invoice-table">
      <h2 className="font-bold text-xl mb-4">Invoice Items</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Quantity</th>
            <th className="border p-2 text-left">Price</th>
            <th className="border p-2 text-left">Discount</th>
            <th className="border p-2 text-left">TVA</th>
            <th className="border p-2 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.price.toFixed(2)}</td>
              <td className="border p-2">{item.discount}%</td>
              <td className="border p-2">{item.tva}%</td>
              <td className="border p-2">
                {(
                  (item.price - item.price * (item.discount / 100)) 
                ).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="font-bold mt-4">Total: {calculateTotal().toFixed(2)}</h3>
    </div>
  );
};

export default InvoiceTable;
