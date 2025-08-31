// src/components/profile/PersonalInfo.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function PersonalInfo({ userProfile, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.personalInfo?.name || "",
    title: userProfile?.personalInfo?.title || "",
    department: userProfile?.personalInfo?.department || "",
    email: userProfile?.personalInfo?.email || "",
    phone: userProfile?.personalInfo?.phone || "",
    location: userProfile?.personalInfo?.location || "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate?.({ personalInfo: formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userProfile?.personalInfo?.name || "",
      title: userProfile?.personalInfo?.title || "",
      department: userProfile?.personalInfo?.department || "",
      email: userProfile?.personalInfo?.email || "",
      phone: userProfile?.personalInfo?.phone || "",
      location: userProfile?.personalInfo?.location || "",
    });
    setIsEditing(false);
  };

  return (
    <Card elevation={0} className="border rounded-xl">
      <CardContent className="p-6">
        <Box className="flex items-center justify-between mb-6">
          <Typography variant="h6" className="font-semibold text-slate-900">
            Personal Information
          </Typography>
          {!isEditing ? (
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Box className="flex gap-2">
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                size="small"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                startIcon={<CancelIcon />}
                variant="outlined"
                size="small"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Profile Picture Section */}
          <Grid item xs={12} md={4}>
            <Box className="flex flex-col items-center">
              <Box className="relative">
                <Avatar
                  src={userProfile?.personalInfo?.photo}
                  alt={formData.name}
                  className="w-32 h-32 mb-4"
                />
                {isEditing && (
                  <IconButton
                    className="absolute bottom-2 right-2 bg-white shadow-md"
                    size="small"
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                )}
              </Box>

              <Typography variant="h6" className="font-semibold text-center">
                {formData.name}
              </Typography>
              <Typography
                variant="body2"
                className="text-slate-600 text-center"
              >
                {formData.title}
              </Typography>

              <Box className="mt-3">
                <Chip
                  label={formData.department}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          </Grid>

          {/* Personal Details */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider className="my-6" />

        {/* Additional Info */}
        <Box>
          <Typography variant="subtitle2" className="font-medium mb-3">
            Account Status
          </Typography>
          <Box className="flex flex-wrap gap-2">
            <Chip label="Active Account" color="success" size="small" />
            <Chip label="Verified Email" color="primary" size="small" />
            <Chip label="2FA Enabled" color="secondary" size="small" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
