"use client";

import DeletePopup from "@/components/Popup/DeletePopup";
import React, { useEffect, useState } from "react";
import { FaTrash, FaTrashAlt } from "react-icons/fa";
import { pages } from "@/lib/page";

const Page = () => {
  // Renamed from "page" to "Page"
  const [roles, setRoles] = useState<
    { _id: string; name: string; access: Record<string, boolean> }[]
  >([]);
  const [newRole, setNewRole] = useState("");
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState({ id: "", name: "" });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleDeleteClick = (role: any) => {
    setUpdatingRole(role._id);
    setSelectedRole({ id: role._id, name: role.ref });
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
      await fetchRoles();
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
      const res = await fetch("/api/role/getrole");
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(data.roles); // Set roles with access
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  async function handleAccessUpdate(
    role: string,
    page: string,
    hasAccess: boolean
  ) {
    setUpdatingRole(`${role}-${page}`); // Set loading state for the specific role and page
    try {
      const res = await fetch("/api/role/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, page, hasAccess }),
      });

      if (!res.ok) throw new Error("Failed to update access");

      setRoles((prevRoles) =>
        prevRoles.map((r) =>
          r.name === role
            ? { ...r, access: { ...r.access, [page]: hasAccess } }
            : r
        )
      );
      setUpdatingRole(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }

  async function handleAddRole() {
    if (!newRole.trim()) {
      alert("Role name cannot be empty.");
      return;
    }

    setIsAddingRole(true);

    try {
      const formData = new FormData();
      formData.append("newRole", newRole); // Append the newRole data to FormData

      const res = await fetch("/api/role/postrole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRole }), // Use FormData as the body of the request
      });

      if (!res.ok) throw new Error("Failed to add role");
      const data = await res.json();
      console.log(data);
      setRoles((prevRoles) => [
        ...prevRoles,
        { name: data.name, access: {}, _id: data._id },
      ]);
      setNewRole("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center ">
        <h1 className="text-3xl font-bold">Roles</h1>
      </div>
      

      <div className="gap-y-8">
        <div className="flex  gap-8 items-center mt-4 pb-9">
          <p className="text-xl font-bold" >new Role :</p>
          <input
            className="bg-gray-50 border border-gray-300 w-1/6 p-2 rounded"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
          <button
            onClick={handleAddRole}
            type="submit"
            className="bg-gray-800 font-bold hover:bg-gray-600
          text-white rounded w-[200px] h-10"
          >
            Ajouter un Role
          </button>
        </div>
        
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-300 px-6 py-3">Role Name</th>
              {pages.map((page) => (
                <th key={page} className="border border-gray-300 px-6 py-3">
                  {page}
                </th>
              ))}
              <th className="border border-gray-300 px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {role.name}
                </td>
                {pages.map((page) => (
                  <td
                    key={page}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    <div className="flex items-center justify-center">
                      {updatingRole === `${role.name}-${page}` ? (
                        <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                      ) : (
                        <input
                          type="checkbox"
                          checked={role.access[page] || false}
                          onChange={(e) =>
                            handleAccessUpdate(
                              role.name,
                              page,
                              e.target.checked
                            )
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
                      id={selectedRole.id} // Pass selected user's id
                      name={selectedRole.name}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page; // Ensure you're exporting the component correctly
