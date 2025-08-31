// src/components/procurement/ProposalEvaluation.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";

const evaluationCriteria = [
  { key: "price", label: "Price", weight: 25, unit: "$" },
  {
    key: "sustainability",
    label: "Sustainability Score",
    weight: 30,
    unit: "/10",
  },
  { key: "delivery", label: "Delivery Time", weight: 20, unit: " days" },
  { key: "quality", label: "Quality Score", weight: 15, unit: "/100" },
  { key: "experience", label: "Experience", weight: 10, unit: " years" },
];

export default function ProposalEvaluation({
  proposals = [],
  onEvaluate,
  onAward,
}) {
  const [weights, setWeights] = useState(
    evaluationCriteria.reduce(
      (acc, criteria) => ({
        ...acc,
        [criteria.key]: criteria.weight,
      }),
      {}
    )
  );

  const [scores, setScores] = useState({});

  const calculateScore = (proposal) => {
    return evaluationCriteria.reduce((total, criteria) => {
      const score = proposal[criteria.key] || 0;
      const weight = weights[criteria.key] || 0;
      return total + (score * weight) / 100;
    }, 0);
  };

  const handleWeightChange = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card elevation={0} className="border rounded-xl">
      <CardContent className="p-6">
        <Typography variant="h6" className="font-semibold text-slate-900 mb-4">
          Proposal Evaluation
        </Typography>

        <Box className="mb-6">
          <Typography variant="subtitle2" className="font-medium mb-3">
            Evaluation Criteria Weights
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evaluationCriteria.map((criteria) => (
              <Box key={criteria.key}>
                <Box className="flex justify-between mb-1">
                  <Typography variant="body2">{criteria.label}</Typography>
                  <Typography variant="body2" className="font-medium">
                    {weights[criteria.key]}%
                  </Typography>
                </Box>
                <Slider
                  value={weights[criteria.key]}
                  onChange={(_, value) =>
                    handleWeightChange(criteria.key, value)
                  }
                  min={0}
                  max={50}
                  step={5}
                />
              </Box>
            ))}
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Sustainability</TableCell>
                <TableCell align="center">Delivery</TableCell>
                <TableCell align="center">Quality</TableCell>
                <TableCell align="center">Total Score</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals.map((proposal, idx) => {
                const totalScore = calculateScore(proposal);
                return (
                  <TableRow key={idx}>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {proposal.supplierName ||
                          `Supplier ${proposal.supplierId}`}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      ${proposal.price?.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <Box className="flex items-center gap-1">
                        <LinearProgress
                          variant="determinate"
                          value={proposal.sustainability * 10}
                          className="w-12 h-1"
                        />
                        <Typography variant="caption">
                          {proposal.sustainability}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {proposal.delivery} days
                    </TableCell>
                    <TableCell align="center">{proposal.quality}/100</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={totalScore.toFixed(1)}
                        color={
                          totalScore >= 80
                            ? "success"
                            : totalScore >= 60
                            ? "warning"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => onAward?.(proposal)}
                      >
                        Award
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box className="mt-4 flex justify-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => onEvaluate?.(proposals, weights)}
          >
            Complete Evaluation
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
