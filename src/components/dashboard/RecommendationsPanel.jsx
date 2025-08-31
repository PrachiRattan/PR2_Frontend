// src/components/dashboard/RecommendationsPanel.jsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

const RecCard = ({ rec }) => (
  <Card elevation={0} className="border rounded-xl">
    <CardContent className="p-4 space-y-2">
      <Typography variant="subtitle2" className="text-slate-900 font-semibold">
        {rec.title}
      </Typography>
      <Typography variant="body2" className="text-slate-600">
        {rec.description}
      </Typography>
      <div className="flex items-center gap-2">
        {rec.impact && <Chip size="small" color="success" label={rec.impact} />}
        {typeof rec.confidence === "number" && (
          <Chip
            size="small"
            variant="outlined"
            label={`Confidence: ${(rec.confidence * 100).toFixed(0)}%`}
          />
        )}
      </div>
      <div className="flex items-center gap-2 pt-1">
        {rec.primary && (
          <Button size="small" variant="text" onClick={rec.onPrimary}>
            {rec.primary}
          </Button>
        )}
        {rec.secondary && (
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={rec.onSecondary}
          >
            {rec.secondary}
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function RecommendationsPanel({ recommendations = [] }) {
  return (
    <div className="space-y-3">
      {recommendations.map((r, idx) => (
        <RecCard key={idx} rec={r} />
      ))}
    </div>
  );
}
