"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { 
  Search, 
  Filter, 
  Edit,
  Loader2,
  RefreshCw,
  XCircle,
  Shield,
  User,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";

const GET_ALL_USERS = gql`
  query GetAllUsers($role: Role, $country: Country) {
    users(role: $role, country: $country) {
      id
      email
      name
      role
      country
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: String!, $role: Role!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      role
    }
  }
`;

const UPDATE_USER_COUNTRY = gql`
  mutation UpdateUserCountry($userId: String!, $country: Country!) {
    updateUserCountry(userId: $userId, country: $country) {
      id
      country
    }
  }
`;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersData {
  users: User[];
}

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "MEMBER", label: "Member" },
];

const countryOptions = [
  { value: "", label: "All Countries" },
  { value: "INDIA", label: "India" },
  { value: "AMERICA", label: "America" },
];

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  MANAGER: "bg-blue-100 text-blue-700",
  MEMBER: "bg-gray-100 text-gray-700",
};

const roleIcons: Record<string, React.ReactNode> = {
  ADMIN: <Shield size={14} />,
  MANAGER: <Shield size={14} />,
  MEMBER: <User size={14} />,
};

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ role: "", country: "" });

  const { data, loading, refetch } = useQuery<UsersData>(GET_ALL_USERS, {
    variables: { 
      role: roleFilter || null,
      country: countryFilter || null
    },
    fetchPolicy: "network-only",
  });

  const [updateUserRole, { loading: roleLoading }] = useMutation(UPDATE_USER_ROLE, {
    onCompleted: () => {
      toast.success("User role updated successfully");
      refetch();
      setEditingUser(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updateUserCountry, { loading: countryLoading }] = useMutation(UPDATE_USER_COUNTRY, {
    onCompleted: () => {
      toast.success("User country updated successfully");
      refetch();
      setEditingUser(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const users = data?.users || [];

  const filteredUsers = users.filter((user: any) => {
    if (!searchQuery) return true;
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const openEditModal = (user: any) => {
    setEditForm({ role: user.role, country: user.country });
    setEditingUser(user);
  };

  const handleUpdateRole = () => {
    if (editForm.role !== editingUser.role) {
      updateUserRole({
        variables: {
          userId: editingUser.id,
          role: editForm.role,
        },
      });
    }
  };

  const handleUpdateCountry = () => {
    if (editForm.country !== editingUser.country) {
      updateUserCountry({
        variables: {
          userId: editingUser.id,
          country: editForm.country,
        },
      });
    }
  };

  const handleSave = () => {
    if (editForm.role !== editingUser.role) {
      handleUpdateRole();
    }
    if (editForm.country !== editingUser.country) {
      handleUpdateCountry();
    }
    if (editForm.role === editingUser.role && editForm.country === editingUser.country) {
      setEditingUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">
            View and manage user accounts and permissions
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-muted-foreground" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background text-sm"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background text-sm"
              >
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <User className="text-primary" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">
                  {users.filter((u: any) => u.role === "ADMIN").length}
                </p>
              </div>
              <Shield className="text-red-500" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Managers</p>
                <p className="text-2xl font-bold">
                  {users.filter((u: any) => u.role === "MANAGER").length}
                </p>
              </div>
              <Shield className="text-blue-500" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-2xl font-bold">
                  {users.filter((u: any) => u.role === "MEMBER").length}
                </p>
              </div>
              <User className="text-gray-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">User</th>
                    <th className="text-left p-4 font-medium text-sm">Email</th>
                    <th className="text-left p-4 font-medium text-sm">Role</th>
                    <th className="text-left p-4 font-medium text-sm">Country</th>
                    <th className="text-left p-4 font-medium text-sm">Joined</th>
                    <th className="text-left p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="border-t hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user.name?.[0] || "U"}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                            roleColors[user.role]
                          )}
                        >
                          {roleIcons[user.role]}
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Globe size={14} className="text-muted-foreground" />
                          {user.country}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(user)}
                        >
                          <Edit size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Edit User</h2>
                <Button variant="ghost" size="sm" onClick={() => setEditingUser(null)}>
                  <XCircle size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {editingUser.name?.[0] || "U"}
                  </div>
                  <div>
                    <p className="font-medium">{editingUser.name}</p>
                    <p className="text-sm text-muted-foreground">{editingUser.email}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-sm mt-1"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="MEMBER">Member</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Admins have full access. Managers can manage orders. Members are regular users.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Country</label>
                  <select
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-sm mt-1"
                  >
                    <option value="INDIA">India</option>
                    <option value="AMERICA">America</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Users can only access restaurants in their country (unless Admin).
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingUser(null)} 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    className="flex-1" 
                    disabled={roleLoading || countryLoading}
                  >
                    {(roleLoading || countryLoading) && (
                      <Loader2 className="animate-spin mr-2" size={16} />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
