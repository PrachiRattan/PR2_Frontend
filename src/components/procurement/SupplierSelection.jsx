// src/components/procurement/SupplierSelection.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} className="mt-4">
    {value === index && children}
  </div>
);

const SupplierCard = ({
  supplier,
  isShortlisted,
  onToggleShortlist,
  showActions = true,
}) => (
  <Box className="p-3 border rounded-lg hover:bg-slate-50 transition-colors">
    <Box className="flex items-start justify-between">
      <Box className="flex items-center gap-3 flex-1">
        <Avatar src={supplier.logo} alt={supplier.name} className="w-10 h-10" />
        <Box className="flex-1">
          <Typography variant="subtitle2" className="font-semibold">
            {supplier.name}
          </Typography>
          <Typography variant="caption" className="text-slate-500">
            {supplier.location?.city}, {supplier.location?.country}
          </Typography>
          <Box className="mt-1">
            <Typography variant="caption" className="text-slate-600">
              Sustainability Score: {supplier.sustainabilityScore}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(supplier.sustainabilityScore / 10) * 100}
              className="h-1 mt-1"
              color="primary"
            />
          </Box>
        </Box>
      </Box>
      {showActions && (
        <IconButton
          size="small"
          onClick={() => onToggleShortlist?.(supplier)}
          className={isShortlisted ? "text-red-600" : "text-green-600"}
        >
          {isShortlisted ? <RemoveCircleIcon /> : <AddCircleIcon />}
        </IconButton>
      )}
    </Box>
    <Box className="mt-2 flex flex-wrap gap-1">
      {supplier.certifications?.slice(0, 3).map((cert) => (
        <Chip key={cert} label={cert} size="small" variant="outlined" />
      ))}
    </Box>
  </Box>
);

export default function SupplierSelection({
  availableSuppliers = [],
  shortlistedSuppliers = [],
  onSupplierShortlist,
}) {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Card elevation={0} className="border rounded-xl">
      <CardContent className="p-4">
        <Typography variant="h6" className="font-semibold text-slate-900 mb-3">
          Supplier Selection
        </Typography>

        <Tabs
          value={tabValue}
          onChange={(_, value) => setTabValue(value)}
          className="mb-4"
        >
          <Tab
            label={`Available (${availableSuppliers.length})`}
            className={tabValue === 0 ? "text-red-600" : ""}
          />
          <Tab
            label={`Shortlisted (${shortlistedSuppliers.length})`}
            className={tabValue === 1 ? "text-red-600" : ""}
          />
          <Tab
            label="Compare"
            className={tabValue === 2 ? "text-red-600" : ""}
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box className="space-y-3 max-h-96 overflow-y-auto">
            {availableSuppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                isShortlisted={shortlistedSuppliers.some(
                  (s) => s.id === supplier.id
                )}
                onToggleShortlist={onSupplierShortlist}
              />
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box className="space-y-3 max-h-96 overflow-y-auto">
            {shortlistedSuppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                isShortlisted={true}
                onToggleShortlist={onSupplierShortlist}
              />
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box className="space-y-3">
            {shortlistedSuppliers.length >= 2 ? (
              <>
                <Typography variant="body2" className="text-slate-600 mb-3">
                  Compare up to 4 suppliers side by side
                </Typography>
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shortlistedSuppliers.slice(0, 4).map((supplier) => (
                    <SupplierCard
                      key={supplier.id}
                      supplier={supplier}
                      showActions={false}
                    />
                  ))}
                </Box>
                <Button variant="outlined" className="w-full">
                  View Detailed Comparison
                </Button>
              </>
            ) : (
              <Typography
                variant="body2"
                className="text-slate-500 text-center py-8"
              >
                Shortlist at least 2 suppliers to compare
              </Typography>
            )}
          </Box>
        </TabPanel>
      </CardContent>
    </Card>
  );
}
