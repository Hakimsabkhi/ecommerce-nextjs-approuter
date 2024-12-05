"use client";
import { FaSpinner } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DeletePopup from "@/components/Popup/DeletePopup";
import { toast } from "react-toastify";
import Link from "next/link";
import Role from "@/models/Role";

interface User {
  _id: string;
  email: string;
  role: string;
}
interface role {
  _id: string;
  name: string;
}
const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<role[]>([]);
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
    fetchrole();
  }, []);

  useEffect(() => {
   filterUsers();
  }, [searchTerm, selectedRole, users]);

  const fetchUsers = async () => {
    try {
    const res = await fetch(`/api/users/userdashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await res.json();
    setUsers(data);
  } catch (err: any) {
    console.log(`[get user] ${err.message}`);
  } finally {
    setLoading(false);
  }
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

  const fetchrole = async () => {
    const res = await fetch(`/api/role/getroles`);
    const data = await res.json();
    setRoles(data.roles);
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
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
         <Link href="/admin/brandlist/addbrand" >
         <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg w-[200px] h-10">
         Role
          </button>
        </Link>
      </div>
      <div className="flex justify-between items-center ">
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4 p-2 border border-gray-300 rounded"
        />

        <select
          name="Role"
          value={selectedRole}
          onChange={handlesearchrole}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[20%] block p-2.5"
          required
        >
          <option value="">All</option>
          <option value="Visiteur">Visiteur</option>
          {roles.map((role, index) =>
            session?.user?.role === "SuperAdmin" ? (
              <option key={index} value={role.name}>
                {role.name}
              </option>
            ) : (
              role.name !== "Admin" && (
                <option key={index} value={role.name}>
                  {role.name}
                </option>
              )
            )
          )}
        </select>
      </div>
      <div className="h-96">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
            <tr className="bg-gray-800">
              <th scope="col" className="px-6 py-3 w-1/3">
                Email
              </th>
              <th scope="col" className="px-6 py-3 w-1/3 text-center">
                Role
              </th>
              <th scope="col" className="px-6 py-3 w-1/3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div className="flex justify-center items-center h-full w-full py-6">
                    <FaSpinner className="animate-spin text-[30px] items-center" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) :users.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucune marque trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user.email}
                </th>
                <td className="px-6 py-2 text-center">
                  <div className="flex items-center justify-center">
                    <select
                      className="w-[50%] text-center border-2 p-2"
                      value={user.role}
                      onChange={(e) =>
                        handleChangeRole(user._id, e.target.value)
                      }
                      disabled={loadingUserId === user._id}
                    >
                      <option value="Visiteur">Visiteur</option>
                      {roles.map((role, index) =>
                        session?.user?.role === "SuperAdmin" ? (
                          <option key={index} value={role.name}>
                            {role.name}
                          </option>
                        ) : (
                          role.name !== "Admin" && (
                            <option key={index} value={role.name}>
                              {role.name}
                            </option>
                          )
                        )
                      )}
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
          </tbody>)}
        </table>
      </div>
      <div className="flex justify-center mt-4">
      </div>
    </div>
  );
};

export default AdminDashboard;
