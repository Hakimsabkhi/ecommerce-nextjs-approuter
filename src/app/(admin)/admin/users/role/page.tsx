"use client"

import React, { useEffect, useState } from 'react'


const page = () => {
  const [roles, setRoles] = useState<
  { name: string; access: Record<string, boolean> }[]
>([]);
const [newRole, setNewRole] = useState('');
const [isAddingRole, setIsAddingRole] = useState(false);
const [updatingRole, setUpdatingRole] = useState<string | null>(null);
const pages = ['Bondelivraison', 'brandlist', 'categorylist', 'company','invoice','orderlist','productlist','promotionlist','revenue','reviewlist',"users"];

useEffect(() => {
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
      body: formData,  // Use FormData as the body of the request
    });
    

    if (!res.ok) throw new Error('Failed to add role');
    const data = await res.json();

    setRoles((prevRoles) => [...prevRoles, { name: data.role.name, access: {} }]);
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
            <form onSubmit={()=>handleAddRole()}
            className='grid grid-cols-1 gap-6'>
            <label className='font-bold'>Role</label>
            <div className='flex gap-2'>
            <input className='bg-gray-50 border border-gray-300 w-1/6 p-2 rounded-lg'
             value={newRole}
             onChange={(e) => setNewRole(e.target.value)}
             disabled={isAddingRole}
            />
            {/* Error message */}
    
      
            <button disabled={isAddingRole} type='submit' className='bg-gray-800 hover:bg-gray-600 w-1/12 p-2 rounded-lg text-white '>{isAddingRole ? 'Adding...' : 'Add Role'}</button>
            </div>
            </form>
        </div>
   
        <div className="relative    h-screen pt-12">
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
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default page