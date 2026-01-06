"use client";

import { useState, useTransition } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserResult = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: number;
  role: string;
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserResult[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const searchUsers = useAction(api.adminActions.searchUsers);
  const setUserRole = useAction(api.adminActions.setUserRole);
  const deleteUserAndData = useAction(api.adminActions.deleteUserAndData);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    startTransition(async () => {
      const results = await searchUsers({ searchQuery });
      setUsers(results);
    });
  };

  const handleSetRole = (userId: string, role: "admin" | "user") => {
    startTransition(async () => {
      await setUserRole({ targetUserId: userId, role });
      if (searchQuery) {
        const results = await searchUsers({ searchQuery });
        setUsers(results);
      }
    });
  };

  const handleDelete = (userId: string, email: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ${email}? This will permanently delete their account and all their data.`
      )
    ) {
      return;
    }

    startTransition(async () => {
      await deleteUserAndData({ targetUserId: userId });
      if (searchQuery) {
        const results = await searchUsers({ searchQuery });
        setUsers(results);
      }
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Search by email or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-md"
        />
        <Button onClick={handleSearch} disabled={isPending}>
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>

      {users === null ? (
        <div className="text-muted-foreground">
          Enter a search term to find users.
        </div>
      ) : users.length === 0 ? (
        <div className="text-muted-foreground">No users found.</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Role</th>
                <th className="text-left p-3 font-medium">Joined</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {user.firstName || user.lastName
                      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                      : "—"}
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        user.role === "admin"
                          ? "text-orange-600 font-medium"
                          : ""
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {user.role === "admin" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetRole(user.id, "user")}
                        disabled={isPending}
                      >
                        Remove Admin
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetRole(user.id, "admin")}
                        disabled={isPending}
                      >
                        Make Admin
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id, user.email)}
                      disabled={isPending}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
