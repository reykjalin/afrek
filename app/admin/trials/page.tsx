"use client";

import { useMemo, useState, useTransition } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Id } from "@/convex/_generated/dataModel";

export default function AdminTrialsPage() {
  const trialEmails = useQuery(api.trialEmails.listAll);
  const deleteTrialEmail = useMutation(api.trialEmails.deleteTrialEmail);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmails = useMemo(() => {
    if (!trialEmails) return [];
    if (!searchQuery.trim()) return trialEmails;
    const query = searchQuery.toLowerCase();
    return trialEmails.filter((trial) =>
      trial.email.toLowerCase().includes(query)
    );
  }, [trialEmails, searchQuery]);

  const handleDelete = (id: Id<"trialEmails">, email: string) => {
    if (
      !confirm(
        `Are you sure you want to remove ${email} from the trial list? This will allow them to sign up for a trial again.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    startTransition(async () => {
      await deleteTrialEmail({ id });
      setDeletingId(null);
    });
  };

  if (!trialEmails) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Trial Management</h1>
      <p className="text-muted-foreground mb-6">
        Users in this list have already used their 30-day trial. Remove an email
        to allow them to sign up for a trial again.
      </p>

      <Input
        type="search"
        placeholder="Search by email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm mb-4"
      />

      {filteredEmails.length === 0 ? (
        <div className="text-muted-foreground">
          {searchQuery.trim()
            ? "No emails match your search."
            : "No trial emails recorded yet."}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Trial Started</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((trial) => (
                <tr key={trial.id} className="border-t">
                  <td className="p-3">{trial.email}</td>
                  <td className="p-3">
                    {new Date(trial.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(trial.id, trial.email)}
                      disabled={isPending && deletingId === trial.id}
                    >
                      {isPending && deletingId === trial.id
                        ? "Removing..."
                        : "Remove"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-4">
        {searchQuery.trim()
          ? `Showing ${filteredEmails.length} of ${trialEmails?.length ?? 0} trial emails`
          : `Total: ${trialEmails?.length ?? 0} trial email${trialEmails?.length !== 1 ? "s" : ""}`}
      </p>
    </div>
  );
}
