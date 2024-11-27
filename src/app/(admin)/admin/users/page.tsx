"use client";
import { FaSpinner } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DeletePopup from "@/components/Popup/DeletePopup";
import { toast } from "react-toastify";
import Link from "next/link";

interface User {
  _id: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState({ id: "", email: "" });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, selectedRole, users]);

  const fetchUsers = async () => {
    const res = await fetch(`/api/users/userdashboard`);
    const data = await res.json();
    setUsers(data);
  };

  const filterUsers = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(lowerCaseSearchTerm) &&
        (selectedRole === "" || user.role === selectedRole)
    );
    setFilteredUsers(filtered);
  };

  const handleDeleteClick = (user: User) => {
    setLoadingUserId(user._id);
    setSelectedUser({ id: user._id, email: user.email });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingUserId(null);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/deleteuserbyid/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete user. Status: ${response.status}`);
      }
      fetchUsers();
      toast.success("User deleted successfully!");
      handleClosePopup();
    } catch (error) {
      toast.error("Failed to delete user.");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    setLoadingUserId(userId);
    try {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }
      const response = await fetch(`/api/users/updateuserrole/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update role");
      }
      setDropdownOpen(null);
      fetchUsers();
    } catch (error) {
      console.error("Error changing role:", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  const handlesearchrole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="flex justify-end">
        <Link href={"/admin/users/role"} className="bg-gray-800 hover:bg-gray-600 rounded-md w-1/5 p-2 text-white flex justify-center items-center mb-4">ROLE</Link>
        </div>
      <div className="flex justify-between items-center pb-4">
      <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[30%] block p-2.5"
      />
      
        <select
          name="Role"
          value={selectedRole}
          onChange={handlesearchrole}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[20%] block p-2.5"
          required
        >
          <option value="">All</option>
          <option value="Consulter">Consulter</option>
          {session?.user?.role === "SuperAdmin" && (
            <option value="Admin">Admin</option>
          )}
          <option value="Visiteur">Visiteur</option>
        </select>
      </div>
      <div className="relative shadow-lg rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xl uppercase">
            <tr className="bg-gray-800">
              <th scope="col" className="px-6 py-3 w-1/3">Email</th>
              <th scope="col" className="px-6 py-3 w-1/3 text-center">Role</th>
              <th scope="col" className="px-6 py-3 w-1/3 text-center">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user.email}
                </th>
                <td className="px-6 py-2 text-center">
                  <div className="flex items-center justify-center">
                    <select
                      className="w-[50%] text-center border-2 p-2"
                      value={user.role}
                      onChange={(e) => handleChangeRole(user._id, e.target.value)}
                      disabled={loadingUserId === user._id}
                    >
                      <option value="Consulter">Consulter</option>
                      {session?.user?.role === "SuperAdmin" && (
                        <option value="Admin">Admin</option>
                      )}
                      <option value="Visiteur">Visiteur</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-2 relative text-center">
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="bg-red-500 w-[50%] text-white py-2 rounded"
                    disabled={loadingUserId === user._id}
                  >
                    {loadingUserId === user._id ? "Processing..." : "DELETE"}
                  </button>
                  {isPopupOpen && (
                    <DeletePopup
                      handleClosePopup={handleClosePopup}
                      Delete={handleDeleteUser}
                      id={selectedUser.id}
                      name={selectedUser.email}
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

export default AdminDashboard;
