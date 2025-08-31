// src/components/profile/Settings.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import SaveIcon from "@mui/icons-material/Save";
import SecurityIcon from "@mui/icons-material/Security";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";

export default function Settings({ userProfile, onUpdate }) {
  const [settings, setSettings] = useState({
    notifications: {
      email: userProfile?.preferences?.notificationSettings?.email ?? true,
      inApp: userProfile?.preferences?.notificationSettings?.inApp ?? true,
      weeklyDigest:
        userProfile?.preferences?.notificationSettings?.weeklyDigest ?? true,
      procurementAlerts: true,
      supplierUpdates: true,
      systemMaintenance: true,
    },
    system: {
      language:
        userProfile?.preferences?.measurementUnits?.language || "English (US)",
      timezone: userProfile?.preferences?.timeZone || "America/New_York",
      currency: "USD - United States Dollar",
      measurementUnits:
        userProfile?.preferences?.measurementUnits?.distance || "Imperial",
    },
    privacy: {
      profileVisibility: "team",
      dataSharing: false,
      analyticsTracking: true,
      marketingEmails: false,
    },
    dashboard: {
      defaultView: "dashboard",
      autoRefresh: true,
      showTips: true,
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate?.({ preferences: settings });
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to original values
    setHasChanges(false);
  };

  return (
    <Box className="space-y-6">
      {hasChanges && (
        <Alert
          severity="info"
          action={
            <Box className="flex gap-2">
              <Button size="small" onClick={handleReset}>
                Reset
              </Button>
              <Button size="small" variant="contained" onClick={handleSave}>
                Save Changes
              </Button>
            </Box>
          }
        >
          You have unsaved changes
        </Alert>
      )}

      {/* Account Settings */}
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Box className="flex items-center gap-2 mb-4">
            <SecurityIcon className="text-slate-600" />
            <Typography variant="h6" className="font-semibold text-slate-900">
              Account Settings
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Button variant="outlined" fullWidth className="h-12">
                Change Password
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button variant="outlined" fullWidth className="h-12">
                Enable Two-Factor Authentication
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box className="p-4 bg-slate-50 rounded-lg">
                <Typography variant="subtitle2" className="font-medium mb-2">
                  Account Status
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  <Chip label="Email Verified" color="success" size="small" />
                  <Chip label="2FA Enabled" color="primary" size="small" />
                  <Chip
                    label="Premium Account"
                    color="secondary"
                    size="small"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Box className="flex items-center gap-2 mb-4">
            <NotificationsIcon className="text-slate-600" />
            <Typography variant="h6" className="font-semibold text-slate-900">
              Notification Preferences
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" className="font-medium mb-3">
                General Notifications
              </Typography>
              <Box className="space-y-2">
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.email}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "email",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.inApp}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "inApp",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="In-App Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.weeklyDigest}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "weeklyDigest",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Weekly Digest"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" className="font-medium mb-3">
                Procurement Alerts
              </Typography>
              <Box className="space-y-2">
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.procurementAlerts}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "procurementAlerts",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Procurement Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.supplierUpdates}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "supplierUpdates",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Supplier Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.systemMaintenance}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "systemMaintenance",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="System Maintenance"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Box className="flex items-center gap-2 mb-4">
            <LanguageIcon className="text-slate-600" />
            <Typography variant="h6" className="font-semibold text-slate-900">
              System Configuration
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.system.language}
                  onChange={(e) =>
                    handleSettingChange("system", "language", e.target.value)
                  }
                  label="Language"
                >
                  <MenuItem value="English (US)">English (US)</MenuItem>
                  <MenuItem value="English (UK)">English (UK)</MenuItem>
                  <MenuItem value="Spanish">Español</MenuItem>
                  <MenuItem value="French">Français</MenuItem>
                  <MenuItem value="German">Deutsch</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={settings.system.timezone}
                  onChange={(e) =>
                    handleSettingChange("system", "timezone", e.target.value)
                  }
                  label="Timezone"
                >
                  <MenuItem value="America/New_York">
                    Eastern Time (GMT-5)
                  </MenuItem>
                  <MenuItem value="America/Chicago">
                    Central Time (GMT-6)
                  </MenuItem>
                  <MenuItem value="America/Denver">
                    Mountain Time (GMT-7)
                  </MenuItem>
                  <MenuItem value="America/Los_Angeles">
                    Pacific Time (GMT-8)
                  </MenuItem>
                  <MenuItem value="Europe/London">London (GMT+0)</MenuItem>
                  <MenuItem value="Europe/Paris">Paris (GMT+1)</MenuItem>
                  <MenuItem value="Asia/Tokyo">Tokyo (GMT+9)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={settings.system.currency}
                  onChange={(e) =>
                    handleSettingChange("system", "currency", e.target.value)
                  }
                  label="Currency"
                >
                  <MenuItem value="USD - United States Dollar">
                    USD - United States Dollar
                  </MenuItem>
                  <MenuItem value="EUR - Euro">EUR - Euro</MenuItem>
                  <MenuItem value="GBP - British Pound">
                    GBP - British Pound
                  </MenuItem>
                  <MenuItem value="JPY - Japanese Yen">
                    JPY - Japanese Yen
                  </MenuItem>
                  <MenuItem value="CAD - Canadian Dollar">
                    CAD - Canadian Dollar
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Measurement Units</InputLabel>
                <Select
                  value={settings.system.measurementUnits}
                  onChange={(e) =>
                    handleSettingChange(
                      "system",
                      "measurementUnits",
                      e.target.value
                    )
                  }
                  label="Measurement Units"
                >
                  <MenuItem value="Imperial">
                    Imperial (miles, pounds, °F)
                  </MenuItem>
                  <MenuItem value="Metric">Metric (km, kg, °C)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Typography
            variant="h6"
            className="font-semibold text-slate-900 mb-4"
          >
            Data & Privacy Settings
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className="mb-4">
                <InputLabel>Profile Visibility</InputLabel>
                <Select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) =>
                    handleSettingChange(
                      "privacy",
                      "profileVisibility",
                      e.target.value
                    )
                  }
                  label="Profile Visibility"
                >
                  <MenuItem value="private">Private</MenuItem>
                  <MenuItem value="team">Team Only</MenuItem>
                  <MenuItem value="organization">Organization</MenuItem>
                  <MenuItem value="public">Public</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy.dataSharing}
                    onChange={(e) =>
                      handleSettingChange(
                        "privacy",
                        "dataSharing",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Allow data sharing for analytics"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className="space-y-2">
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.analyticsTracking}
                      onChange={(e) =>
                        handleSettingChange(
                          "privacy",
                          "analyticsTracking",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Analytics Tracking"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.marketingEmails}
                      onChange={(e) =>
                        handleSettingChange(
                          "privacy",
                          "marketingEmails",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Marketing Emails"
                />
              </Box>
            </Grid>
          </Grid>

          <Divider className="my-4" />

          <Box className="flex gap-2">
            <Button variant="outlined" color="error" size="small">
              Export Data
            </Button>
            <Button variant="outlined" color="error" size="small">
              Delete Account
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box className="flex justify-end">
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasChanges}
          size="large"
        >
          Save All Settings
        </Button>
      </Box>
    </Box>
  );
}
