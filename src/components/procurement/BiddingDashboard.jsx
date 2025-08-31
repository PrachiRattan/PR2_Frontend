// src/components/procurement/BiddingDashboard.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} className="mt-4">
    {value === index && children}
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case "Bidding Open":
      return "success";
    case "Evaluation":
      return "warning";
    case "Awarded":
      return "primary";
    case "Draft":
      return "default";
    default:
      return "default";
  }
};

const getInterestColor = (level) => {
  switch (level) {
    case "high":
      return "success";
    case "medium":
      return "warning";
    case "low":
      return "error";
    default:
      return "default";
  }
};

export default function BiddingDashboard({
  projects = [],
  interestedSuppliers = [],
  onViewProposal,
  onSendMessage,
}) {
  const [tabValue, setTabValue] = useState(0);
  const [message, setMessage] = useState("");

  const activeProject = projects; // Assuming first project is active

  return (
    <Box className="space-y-6">
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Typography
            variant="h6"
            className="font-semibold text-slate-900 mb-4"
          >
            Active Bidding Dashboard
          </Typography>

          {activeProject && (
            <Box className="flex items-center justify-between mb-4">
              <Box>
                <Typography variant="subtitle1" className="font-semibold">
                  {activeProject.name}
                </Typography>
                <Box className="flex items-center gap-2 mt-1">
                  <Typography variant="caption" className="text-slate-600">
                    PROJECT STATUS
                  </Typography>
                  <Chip
                    label={activeProject.bidding?.status || "Draft"}
                    size="small"
                    color={getStatusColor(activeProject.bidding?.status)}
                  />
                </Box>
              </Box>
              <Box className="w-32 h-20 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Box className="text-center">
                  <Box className="w-8 h-8 bg-emerald-600 rounded-full mx-auto mb-1"></Box>
                  <Typography variant="caption" className="text-emerald-700">
                    Active
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Typography
            variant="h6"
            className="font-semibold text-slate-900 mb-4"
          >
            Interest Management
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Preliminary Proposal</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interestedSuppliers.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" className="font-medium">
                          {item.supplierName || `Supplier ${item.supplierId}`}
                        </Typography>
                        <Chip
                          size="small"
                          label={item.interestLevel}
                          color={getInterestColor(item.interestLevel)}
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {item.preliminaryProposal ? (
                        <Box>
                          <Typography variant="body2">
                            Price: $
                            {item.preliminaryProposal.price?.toLocaleString()}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-slate-500"
                          >
                            Delivery: {item.preliminaryProposal.deliveryTime}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" className="text-slate-500">
                          Submitted
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => onViewProposal?.(item)}
                      >
                        View Proposal
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Typography
            variant="h6"
            className="font-semibold text-slate-900 mb-4"
          >
            Bidding Process
          </Typography>

          <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
            <Tab
              label="Communication Center"
              className={tabValue === 0 ? "text-red-600" : ""}
            />
            <Tab label="Proposal Evaluation" />
            <Tab label="Timeline Tracker" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box className="space-y-4">
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Type your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                label="Message"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  onSendMessage?.(message);
                  setMessage("");
                }}
                disabled={!message.trim()}
              >
                Send
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="body2" className="text-slate-600">
              Proposal evaluation tools will appear here once bidding closes.
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box className="space-y-3">
              <Box className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <Typography variant="body2">Bid Opening</Typography>
                <Chip label="Upcoming" size="small" color="warning" />
              </Box>
              <Box className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <Typography variant="body2">Evaluation Complete</Typography>
                <Chip label="Pending" size="small" color="default" />
              </Box>
              <Box className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <Typography variant="body2">Award</Typography>
                <Chip label="Pending" size="small" color="default" />
              </Box>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}
