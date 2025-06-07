"use client";
import { useAuth } from "@/lib/auth/authContext";
import { useEffect, useRef, useState } from "react";
import { MdModeEdit, MdSave } from "react-icons/md";
import countries from "@/lib/services/countries";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "@/components/loading";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("");
  const [nationality, setNationality] = useState("");
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialState = useRef({ displayName, bio, nationality });
  const [saved, setSaved] = useState(false);
  const hasChanges =
    displayName !== initialState.current.displayName ||
    bio !== initialState.current.bio ||
    nationality !== initialState.current.nationality;

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    const fetchProfile = async () => {
      try {
        const token = await user.getIdToken();

        if (token) {
          const response = await axios.get("/api/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            const data = response.data;
            setDisplayName(data.username || user.displayName || "");
            setBio(data.bio || "");
            setNationality(data.nationality || "");
          }
        } else {
          router.replace("/login");
        }
      } catch {
        toast.error("Failed to fetch profile data.");
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user?.uid) return;
    setEditing(false);
    setSaving(true);
    setSaved(false);

    try {
      const token = await user.getIdToken();

      const response = await axios.post(
        "/api/profile",
        {
          uid: user.uid,
          displayName,
          bio,
          nationality,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setSaved(true);
        initialState.current = { displayName, bio, nationality };
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to save profile data.");
    }

    setSaving(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="flex flex-col p-6 mx-auto lg:min-w-3xl h-full gap-6">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      <p className="text-gray-600">This is your public profile on ChessMate.</p>

      {/* Avatar and Display Name */}
      <div className="flex items-center gap-6">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="User Avatar"
          className="w-16 h-16 md:h-28 md:w-28 rounded-full object-cover border"
        />
        <div className="flex flex-col md:gap-2">
          {editing ? (
            <input
              className="border p-2 rounded w-full"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
            />
          ) : (
            <h2 className="md:text-2xl font-semibold">
              {displayName || "User Name"}
            </h2>
          )}
          <span className="text-gray-500 text-sm">{user?.email}</span>
        </div>
        <button
          className="ml-auto text-blue-600 hover:underline flex items-center gap-1"
          onClick={() => setEditing(!editing)}
        >
          <MdModeEdit size={20} />
          {editing ? "Done Editing" : "Edit Profile"}
        </button>
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-2">
        <label htmlFor="bio" className="font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          placeholder="Write something about yourself..."
          className="border rounded p-2 w-full"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      {/* Nationality */}
      <div className="flex flex-col gap-2">
        <label htmlFor="nationality" className="font-medium">
          Nationality
        </label>
        <Select value={nationality} onValueChange={setNationality}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.emoji} {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {nationality && (
          <span className="text-sm text-gray-600 mt-1">
            Selected: {countries.find((c) => c.code === nationality)?.emoji}{" "}
            {countries.find((c) => c.code === nationality)?.name}
          </span>
        )}
      </div>

      {hasChanges && (
        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant={"secondary"}
            onClick={() => {
              setDisplayName(initialState.current.displayName);
              setBio(initialState.current.bio);
              setNationality(initialState.current.nationality);
              setSaved(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
      {saved && !hasChanges && (
        <p className="text-green-600 text-sm text-right mt-2">
          ✅ Changes saved successfully!
        </p>
      )}
    </main>
  );
}
