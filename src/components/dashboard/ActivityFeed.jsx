// src/components/dashboard/ActivityFeed.jsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UpdateIcon from "@mui/icons-material/Update";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import FactoryIcon from "@mui/icons-material/Factory";

const iconFor = (type) => {
  switch (type) {
    case "supplier_onboarded":
      return <FactoryIcon className="text-emerald-600" />;
    case "category_updated":
      return <UpdateIcon className="text-blue-600" />;
    case "report_generated":
      return <AnalyticsIcon className="text-slate-700" />;
    default:
      return <CheckCircleIcon className="text-slate-500" />;
  }
};

export default function ActivityFeed({ activities = [] }) {
  return (
    <Card elevation={0} className="border rounded-xl">
      <CardContent className="p-5">
        <Typography
          variant="subtitle1"
          className="font-semibold text-slate-900 mb-2"
        >
          Recent Activity
        </Typography>
        <List dense>
          {activities.map((a, idx) => (
            <ListItem key={idx} className="px-0">
              <ListItemAvatar>
                <Avatar className="bg-slate-100">{iconFor(a.type)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <span className="text-slate-900 text-sm">{a.title}</span>
                }
                secondary={
                  <span className="text-slate-500 text-xs">
                    {a.subtitle} • {new Date(a.timestamp).toLocaleString()}
                  </span>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
