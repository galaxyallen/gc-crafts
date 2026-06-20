"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Topbar } from "@/components/admin/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminFetch } from "@/lib/admin-fetch";
import { readApiError } from "@/lib/client-api";

type SettingsMap = Record<string, string>;

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function load() {
      const res = await adminFetch("/api/settings");
      if (res.ok) setSettings(await res.json());
      setLoading(false);
    }
    load();
  }, []);

  function update(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function saveSettings(keys: string[], setter: (v: boolean) => void) {
    setter(true);
    setMessage(null);
    setError(null);

    const subset = Object.fromEntries(keys.map((k) => [k, settings[k] ?? ""]));

    const res = await adminFetch("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ settings: subset }),
    });

    setter(false);
    if (res.ok) {
      setMessage("Settings saved");
    } else {
      setError(await readApiError(res, "Failed to save"));
    }
  }

  async function handlePasswordChange() {
    setSavingPassword(true);
    setMessage(null);
    setError(null);

    const res = await adminFetch("/api/settings", {
      method: "PUT",
      body: JSON.stringify({
        passwordChange: { currentPassword, newPassword, confirmPassword },
      }),
    });

    setSavingPassword(false);

    if (res.ok) {
      setMessage("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError(await readApiError(res, "Failed to update password"));
    }
  }

  if (loading) {
    return (
      <>
        <Topbar title="Settings" />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-sm text-t3">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Settings" />
      <div className="flex-1 space-y-6 p-6">
        {message && <p className="text-sm text-green-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <Card className="bg-char-dd">
          <CardHeader>
            <CardTitle>Company Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company name</Label>
              <Input
                id="company_name"
                value={settings.company_name ?? ""}
                onChange={(e) => update("company_name", e.target.value)}
              />
            </div>
            <Button
              size="sm"
              onClick={() => saveSettings(["company_name"], setSavingCompany)}
              disabled={savingCompany}
            >
              {savingCompany ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-char-dd">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={settings.email ?? ""} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={settings.whatsapp ?? ""}
                  onChange={(e) => update("whatsapp", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.instagram ?? ""}
                  onChange={(e) => update("instagram", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={settings.linkedin ?? ""}
                  onChange={(e) => update("linkedin", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.facebook ?? ""}
                  onChange={(e) => update("facebook", e.target.value)}
                  placeholder="https://facebook.com/your-page"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_1">Address line 1</Label>
                <Input
                  id="address_1"
                  value={settings.address_1 ?? ""}
                  onChange={(e) => update("address_1", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_2">Address line 2</Label>
                <Input
                  id="address_2"
                  value={settings.address_2 ?? ""}
                  onChange={(e) => update("address_2", e.target.value)}
                />
              </div>
            </div>
            <Button
              size="sm"
              onClick={() =>
                saveSettings(
                  ["email", "whatsapp", "instagram", "linkedin", "facebook", "address_1", "address_2"],
                  setSavingContact
                )
              }
              disabled={savingContact}
            >
              {savingContact ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-char-dd">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notification_email">Inquiry notification email</Label>
              <Input
                id="notification_email"
                type="email"
                value={settings.notification_email ?? ""}
                onChange={(e) => update("notification_email", e.target.value)}
              />
            </div>
            <Button
              size="sm"
              onClick={() => saveSettings(["notification_email"], setSavingNotifications)}
              disabled={savingNotifications}
            >
              {savingNotifications ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-char-dd">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <Button size="sm" onClick={handlePasswordChange} disabled={savingPassword}>
              {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Update password
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
