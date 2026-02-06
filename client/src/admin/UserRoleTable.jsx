import { useContext } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import { confirmToast } from "../utils/confirmToast";
import { AuthContext } from "../context/AuthContext";

const roleStyles = {
  student: "bg-blue-500/20 text-blue-400",
  groupAdmin: "bg-green-500/20 text-green-400",
  superadmin: "bg-purple-500/20 text-purple-400",
};

const UserRoleTable = ({ users, setUsers }) => {
  const { user: currentUser } = useContext(AuthContext);

  /* ================= TOGGLE GROUP ADMIN ================= */
  const toggleGroupAdmin = async (targetUser) => {
    try {
      const res = await API.put(
        `/admin/users/${targetUser._id}/group-admin`
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUser._id ? res.data : u
        )
      );

      toast.success(
        `${targetUser.name} is now ${
          res.data.isGroupAdmin ? "GROUP ADMIN" : "STUDENT"
        }`
      );
    } catch {
      toast.error("Failed to update group admin");
    }
  };

  /* ================= DELETE USER ================= */
  const deleteUser = (id, name) => {
    confirmToast({
      message: `Delete user "${name}" permanently?`,
      onConfirm: async () => {
        try {
          await API.delete(`/admin/users/${id}`);
          setUsers((prev) => prev.filter((u) => u._id !== id));
          toast.success("User deleted successfully");
        } catch {
          toast.error("Failed to delete user");
        }
      },
    });
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#1f2937]/80 backdrop-blur overflow-hidden">
      
      {/* HEADER */}
      <div className="hidden md:grid grid-cols-5 px-6 py-4 text-sm text-gray-400 border-b border-white/10">
        <span>Name</span>
        <span>Email</span>
        <span>Group</span>
        <span>Role</span>
        <span className="text-right">Actions</span>
      </div>

      {users.map((user) => {
        const roleLabel =
          user.role === "superadmin"
            ? "SUPER ADMIN"
            : user.isGroupAdmin
            ? "GROUP ADMIN"
            : "STUDENT";

        const roleStyle =
          user.role === "superadmin"
            ? roleStyles.superadmin
            : user.isGroupAdmin
            ? roleStyles.groupAdmin
            : roleStyles.student;

        return (
          <div
            key={user._id}
            className="border-b border-white/5 px-4 py-4 md:px-6 md:grid md:grid-cols-5 md:items-center gap-y-2"
          >
            {/* NAME */}
            <div className="font-medium text-white">
              {user.name}
            </div>

            {/* EMAIL */}
            <div className="text-gray-400 truncate">
              {user.email}
            </div>

            {/* GROUP */}
            <div>
              <span className="px-3 py-1 rounded-full text-xs bg-slate-700 text-slate-200 font-mono">
                {user.groupId}
              </span>
            </div>

            {/* ROLE */}
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${roleStyle}`}
              >
                {roleLabel}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 justify-end">
              {currentUser?.role === "superadmin" &&
                user.role !== "superadmin" && (
                  <>
                    <button
                      onClick={() => toggleGroupAdmin(user)}
                      className={`px-3 py-1 rounded-md text-xs text-white ${
                        user.isGroupAdmin
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {user.isGroupAdmin
                        ? "Remove Admin"
                        : "Make Admin"}
                    </button>

                    <button
                      onClick={() =>
                        deleteUser(user._id, user.name)
                      }
                      className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserRoleTable;
