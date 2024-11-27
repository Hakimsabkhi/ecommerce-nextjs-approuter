"use client"
import Link from 'next/link';
import React, { FormEvent, useEffect, useState } from 'react'
import { FaArrowCircleLeft, FaRegTrashAlt } from 'react-icons/fa';
import DeletePopup from "@/components/Popup/DeletePopup"
import { toast } from 'react-toastify';

interface role{
  _id:string;
  name:string;
  user:User;
}
interface User{
  _id:string;
  username:string;

}

const page = () => {
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState<role[]>([]);
    const [error, setError] = useState<string>('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedrole, setSelectedrole] = useState({ id: "", name: "" });
    const [loadingroleId, setLoadingRoleId] = useState<string | null>(null);
    const handleDeleteClick = (role:role) => {

      setLoadingRoleId(role._id); 
      
      setSelectedrole({ id: role._id, name: role.name });
      setIsPopupOpen(true);
    };
  
    const handleClosePopup = () => {
      setIsPopupOpen(false);
      setLoadingRoleId(null); 
    };
  const Deleterole = async (id: string) => {
        
    try {
        const response = await fetch(`/api/role/deleterolebyid/${id}`, {
            method: 'DELETE',
            
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        handleClosePopup();
        toast.success("role delete successfully!" );
        fetchData();
       
       // await getOrders();

    } catch (err: any) {
        
        toast.error(`problem Delete role` );
    }finally{
        setLoadingRoleId(null); 
      }
};
    const fetchData = async () => {
      const [roleResponse] = await Promise.all([
        fetch(`/api/role/getrole`),
      ]);

      const roleData = await roleResponse.json();
      setRoles(roleData);
     
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRole(e.target.value);
        setError(''); // Clear the error message when the user starts typing
      };
      // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
     // Check if the role is empty
     if (role.trim() === '') {
      setError('Please enter a role'); // Set the error message
      return; // Do not proceed with form submission
    }
    const formData = new FormData();
    formData.append("role", role); // Append userId

    try {
      const res = await fetch(`/api/role/postrole`, {
        method: "POST",
        body: formData, // Send FormData as the request body
      });
      fetchData();
    }catch{
      console.log('problem post role')
    }

   

    // Optionally, clear the textarea after submission
    setRole('');
  };
  useEffect(() => {
   
    fetchData();
  }, []);
  return (
    <div className="container mx-auto p-8 grid grid-cols-2 gap-10 max-md:grid-cols-1">
     
        <div className='  '>
      <div className='flex'>
      <Link href={"/admin/users"} className='bg-gray-600 text-white p-2  grid grid-cols-2 items-center gap-2 rounded-lg'>
     <FaArrowCircleLeft size={25}/><a className='uppercase'>back</a>
      </Link>
      </div>
            <h1 className='text-4xl font-bold uppercase pb-6 pt-2'>create role</h1>
            <form onSubmit={handleSubmit}
            className='grid grid-cols-1 gap-6'>
            <label className='font-bold'>Role</label>
            <div>
            <input className='bg-gray-50 border border-gray-300 w-full p-2 rounded-lg'
             value={role} 
             onChange={handleChange}
            />
            {/* Error message */}
      {error && (
        <div className="text-red-500 text-xs">
          {error} {/* Show error message if the error state is set */}
        </div>
      )}
      </div>
            <button type='submit' className='bg-gray-800 hover:bg-gray-600 w-full p-2 rounded-lg text-white '>SAVE</button>
            </form>
        </div>
   
        <div className="relative   md:border-l-2 max-md:border-t-2 pl-4 h-screen pt-12">
        <h1 className='text-4xl font-bold uppercase pb-16'>Liste role</h1>
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xl uppercase">
            <tr className="bg-gray-800">
              <th scope="col" className="px-6 py-3 w-1/3 text-center">Role</th>
              <th scope="col" className="px-6 py-3 w-1/3 text-center">Created By</th>
              <th scope="col" className="px-6 py-3 w-1/3 text-center">Actions</th>
            </tr>
          </thead>
          
          <tbody>
          
          {roles.map((item) => (   <tr  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700  text-[20px]">
                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                 {item.name}
                </th>
                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                 {item.user.username}
                 </th>
                 
                <td className="px-6 py-2 relative text-center">
                 <button onClick={()=>handleDeleteClick(item)} className=" text-gray-800 w-28 h-10 "
                    disabled={loadingroleId === item._id}
                  >
                    {loadingroleId === item._id ? "Processing..." : <FaRegTrashAlt/>}
                 </button>
                 
                </td>
              </tr>
             ))}
          </tbody>
        </table>
      </div>
      {isPopupOpen &&     < DeletePopup  handleClosePopup={handleClosePopup} Delete={Deleterole}  id={selectedrole.id} // Pass selected user's id
                    name={selectedrole.name} />}      
    </div>
  )
}

export default page