"use client"

import DeletePopup from '@/components/Popup/DeletePopup';
import React, { useEffect, useState } from 'react'
import { FaTrash, FaTrashAlt } from 'react-icons/fa';


const page = () => {
  const [roles, setRoles] = useState<
  { _id:string;name: string; access: Record<string, boolean> }[]
>([]);
const [newRole, setNewRole] = useState('');
const [isAddingRole, setIsAddingRole] = useState(false);
const [updatingRole, setUpdatingRole] = useState<string | null>(null);
const [selectedrole, setSelectedrole] = useState({ id: "", name: "" });
const [isPopupOpen, setIsPopupOpen] = useState(false);
const pages = ['Bondelivraison', 'brandlist', 'categorylist', 'company','invoice','orderlist','productlist','promotionlist','revenue','reviewlist',];
const handleDeleteClick = (role: any) => {
  setUpdatingRole(role._id);

  setSelectedrole({ id: role._id, name: role.ref });
  setIsPopupOpen(true);
};
const Deleterole = async (id: string) => {
  try {
    const response = await fetch(`/api/role/deleterolebyid/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    handleClosePopup();

    await fetchRoles();;
  } catch (err: any) {
    console.error(`[order_DELETE] ${err.message}`);
  } finally {
    setUpdatingRole(null);
  }
};
const handleClosePopup = () => {
  setIsPopupOpen(false);
  setUpdatingRole(null);
};
async function fetchRoles() {
  try {
    const res = await fetch('/api/role/getrole');
    if (!res.ok) throw new Error('Failed to fetch roles');
    const data = await res.json();

    setRoles(data.roles); // Set roles with access
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}
useEffect(() => {
  

  fetchRoles();
}, []);

async function handleAccessUpdate(role: string, page: string, hasAccess: boolean) {
  setUpdatingRole(`${role}-${page}`); // Set loading state for the specific role and page
  try {
    const res = await fetch('/api/role/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, page, hasAccess }),
    });

    if (!res.ok) throw new Error('Failed to update access');

    setRoles((prevRoles) =>
      prevRoles.map((r) =>
        r.name === role ? { ...r, access: { ...r.access, [page]: hasAccess } } : r
      )
    );
    setUpdatingRole(null);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}

 async function handleAddRole() {
  if (!newRole.trim()) {
    alert('Role name cannot be empty.');
    return;
  }

  setIsAddingRole(true);

  try {
    const formData = new FormData();
    formData.append('newRole', newRole);  // Append the newRole data to FormData

    const res = await fetch('/api/role/postrole', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newRole }),// Use FormData as the body of the request
    });
   


    if (!res.ok) throw new Error('Failed to add role');
    const data = await res.json();
    console.log(data)
    setRoles((prevRoles) => [...prevRoles, { name: data.name, access: {}, _id:data._id}]);
    setNewRole('');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}

  return (
    <div className="container mx-auto p-8 grid grid-rows-1 gap-10 max-md:grid-cols-1">
     
        <div className='  '>
      <div className=''>
    
      </div>
            <h1 className='text-4xl font-bold uppercase pb-6 pt-2'>create role</h1>
            <div 
            className='grid grid-cols-1 gap-6'>
            <label className='font-bold'>Role</label>
            <div className='flex gap-2'>
            <input className='bg-gray-50 border border-gray-300 w-1/6 p-2 rounded-lg'
             value={newRole}
             onChange={(e) => setNewRole(e.target.value)}
            
            />
            {/* Error message */}
    
      
            <button  onClick={handleAddRole}type='submit' className='bg-gray-800 hover:bg-gray-600 w-1/12 p-2 rounded-lg text-white '>save</button>
            </div>
            </div>
        </div>
   
        <div className="relative    h-screen ">
        <h1 className='text-4xl font-bold uppercase pb-16'>Liste role</h1>
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xl uppercase">
            <tr className="bg-gray-800">
            <th className="border border-gray-300 px-4 py-2">Role Name</th>
            {pages.map((page) => (
              <th key={page} className="border border-gray-300 px-4 py-2">
                {page}
              </th>
            ))}
             <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          
          <tbody>
          {roles.map((role, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{role.name}</td>
              {pages.map((page) => (
                <td key={page} className="border border-gray-300 px-4 py-2 text-center">
                  <div className="flex items-center justify-center">
                    {updatingRole === `${role.name}-${page}` ? (
                      <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                    ) : (
                      <input
                        type="checkbox"
                        checked={role.access[page] || false}
                        onChange={(e) =>
                          handleAccessUpdate(role.name, page, e.target.checked)
                        }
                        className="w-6 h-6"
                      />
                    )}
                  </div>
                </td>
              ))}
                   <td className="border border-gray-300 px-4 py-2">
                   <button
                        onClick={() => handleDeleteClick(role)}
                        className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                        disabled={updatingRole === role._id}
                      >
                        {updatingRole === role._id ? (
                          <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                        ) : (
                          <FaTrashAlt />
                        )}
                      </button>
                      {isPopupOpen && (
                        <DeletePopup
                          handleClosePopup={handleClosePopup}
                          Delete={Deleterole}
                          id={selectedrole.id} // Pass selected user's id
                          name={selectedrole.name}
                        />
                      )}
                   </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default page