// src/components/scenarios/AIRecommendations.jsx
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY
);

export default function AIRecommendations({
  projectData,
  suppliers = [],
  onRecommendationSelect,
}) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    if (projectData && suppliers.length > 0) {
      generateRecommendations();
    }
  }, [projectData, suppliers]);

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    setAnalysisProgress(0);

    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Prepare prompt with project and supplier data
      const prompt = `
        As a sustainability procurement expert, analyze the following scenario and provide supplier recommendations:
        
        Project Requirements:
        - Products: ${
          projectData?.products
            ?.map((p) => `${p.name} (${p.quantity} units)`)
            .join(", ") || "Not specified"
        }
        - Sustainability Priorities: ${JSON.stringify(
          projectData?.sustainabilityPriorities || {}
        )}
        - Delivery Requirements: ${
          projectData?.deliveryRequirements || "Standard"
        }
        
        Available Suppliers:
        ${suppliers
          .map(
            (s) => `
        - ${s.name}: 
          * Location: ${s.location?.city}, ${s.location?.country}
          * Sustainability Score: ${s.sustainabilityScore}/10
          * Carbon Footprint: ${
            s.carbonFootprint?.perUnit || 0
          } kg CO2e per unit
          * Certifications: ${s.certifications?.join(", ") || "None"}
          * Recycling Content: ${s.recyclingContent || 0}%
          * Risk Level: ${s.riskLevel}
        `
          )
          .join("\n")}
        
        Please provide:
        1. Top 3 supplier recommendations with detailed reasoning
        2. Optimal supplier allocation percentages
        3. Expected carbon savings vs industry average
        4. Risk assessment and mitigation strategies
        5. Cost-benefit analysis summary
        
        Format as JSON with the following structure:
        {
          "recommendations": [
            {
              "rank": 1,
              "supplierId": "supplier_id",
              "supplierName": "name",
              "allocationPercentage": 45,
              "reasoning": "detailed explanation",
              "carbonSavings": "15% reduction",
              "confidence": 0.85,
              "keyBenefits": ["benefit1", "benefit2"]
            }
          ],
          "overallStrategy": "strategy description",
          "expectedSavings": {
            "carbon": "20% reduction",
            "cost": "potential 5-10% savings"
          },
          "risks": ["risk1", "risk2"],
          "alternatives": ["alternative scenario 1"]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      try {
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiData = JSON.parse(jsonMatch[0]);
          setRecommendations(aiData);
        } else {
          // Fallback if JSON parsing fails
          const fallbackRecommendations = generateFallbackRecommendations();
          setRecommendations(fallbackRecommendations);
        }
      } catch (parseError) {
        console.warn(
          "Failed to parse AI response, using fallback:",
          parseError
        );
        const fallbackRecommendations = generateFallbackRecommendations();
        setRecommendations(fallbackRecommendations);
      }
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      setError("Failed to generate AI recommendations. Please try again.");
      const fallbackRecommendations = generateFallbackRecommendations();
      setRecommendations(fallbackRecommendations);
    } finally {
      setLoading(false);
      setAnalysisProgress(100);
    }
  };

  const generateFallbackRecommendations = () => {
    // Fallback logic using existing recommendation engine
    const sortedSuppliers = suppliers
      .map((supplier) => ({
        ...supplier,
        score: calculateSupplierScore(
          supplier,
          projectData?.sustainabilityPriorities
        ),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return {
      recommendations: sortedSuppliers.map((supplier, index) => ({
        rank: index + 1,
        supplierId: supplier.id,
        supplierName: supplier.name,
        allocationPercentage: index === 0 ? 50 : index === 1 ? 30 : 20,
        reasoning: `Strong sustainability score (${
          supplier.sustainabilityScore
        }/10) and ${
          supplier.carbonFootprint?.perUnit < 3 ? "low" : "moderate"
        } carbon footprint`,
        carbonSavings: `${Math.round(
          ((4 - (supplier.carbonFootprint?.perUnit || 4)) / 4) * 100
        )}% vs industry average`,
        confidence: 0.8 - index * 0.1,
        keyBenefits: [
          supplier.certifications?.length > 2
            ? "Strong certifications"
            : "Basic compliance",
          supplier.recyclingContent > 50
            ? "High recycled content"
            : "Standard materials",
          supplier.riskLevel === "low" ? "Low risk profile" : "Managed risk",
        ],
      })),
      overallStrategy:
        "Risk-optimized allocation prioritizing sustainability leaders",
      expectedSavings: {
        carbon: "15-25% reduction vs baseline",
        cost: "Potential 5-8% savings through optimization",
      },
      risks: ["Supply concentration", "Market volatility"],
      alternatives: [
        "Single-source with top performer",
        "Equal distribution strategy",
      ],
    };
  };

  const calculateSupplierScore = (supplier, priorities = {}) => {
    const weights = {
      carbonFootprint: priorities.carbonFootprint || 0.3,
      recycling: priorities.recycling || 0.2,
      certifications: priorities.certifications || 0.2,
      sustainability: 0.3,
    };

    const carbonScore = Math.max(
      0,
      10 - (supplier.carbonFootprint?.perUnit || 5)
    );
    const recyclingScore = (supplier.recyclingContent || 0) / 10;
    const certScore = Math.min(10, (supplier.certifications?.length || 0) * 2);
    const sustainabilityScore = supplier.sustainabilityScore || 5;

    return (
      carbonScore * weights.carbonFootprint +
      recyclingScore * weights.recycling +
      certScore * weights.certifications +
      sustainabilityScore * weights.sustainability
    );
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "success";
    if (confidence >= 0.6) return "warning";
    return "error";
  };

  return (
    <Card elevation={0} className="border rounded-xl">
      <CardContent className="p-6">
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-semibold text-slate-900">
            AI-Powered Analysis
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={generateRecommendations}
            disabled={loading}
          >
            {loading ? <CircularProgress size={16} /> : "Regenerate"}
          </Button>
        </Box>

        {loading && (
          <Box className="mb-4">
            <Box className="flex justify-between text-sm mb-2">
              <span>Analyzing procurement scenarios...</span>
              <span>{analysisProgress}%</span>
            </Box>
            <LinearProgress variant="determinate" value={analysisProgress} />
          </Box>
        )}

        {error && (
          <Alert severity="warning" className="mb-4">
            {error}
          </Alert>
        )}

        {recommendations.recommendations && (
          <Box className="space-y-4">
            {/* Overall Strategy */}
            {recommendations.overallStrategy && (
              <Box className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Typography
                  variant="subtitle2"
                  className="font-medium text-blue-800 mb-2"
                >
                  Recommended Strategy
                </Typography>
                <Typography variant="body2" className="text-blue-700">
                  {recommendations.overallStrategy}
                </Typography>
              </Box>
            )}

            {/* Expected Savings */}
            {recommendations.expectedSavings && (
              <Box className="grid grid-cols-2 gap-4">
                <Box className="p-3 bg-green-50 rounded-lg">
                  <Typography variant="caption" className="text-green-600">
                    Carbon Savings
                  </Typography>
                  <Typography variant="h6" className="font-bold text-green-700">
                    {recommendations.expectedSavings.carbon}
                  </Typography>
                </Box>
                <Box className="p-3 bg-emerald-50 rounded-lg">
                  <Typography variant="caption" className="text-emerald-600">
                    Cost Impact
                  </Typography>
                  <Typography
                    variant="h6"
                    className="font-bold text-emerald-700"
                  >
                    {recommendations.expectedSavings.cost}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Supplier Recommendations */}
            <Typography variant="subtitle2" className="font-medium">
              Supplier Allocation Recommendations
            </Typography>

            {recommendations.recommendations.map((rec) => (
              <Box
                key={rec.supplierId}
                className="p-4 border rounded-lg hover:bg-slate-50"
              >
                <Box className="flex justify-between items-start mb-2">
                  <Box>
                    <Box className="flex items-center gap-2">
                      <Chip
                        label={`#${rec.rank}`}
                        size="small"
                        color={rec.rank === 1 ? "primary" : "default"}
                      />
                      <Typography variant="subtitle2" className="font-semibold">
                        {rec.supplierName}
                      </Typography>
                    </Box>
                    <Typography variant="caption" className="text-slate-500">
                      Allocation: {rec.allocationPercentage}% • Savings:{" "}
                      {rec.carbonSavings}
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <Chip
                      label={`${Math.round(rec.confidence * 100)}% confidence`}
                      size="small"
                      color={getConfidenceColor(rec.confidence)}
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Typography variant="body2" className="text-slate-600 mb-2">
                  {rec.reasoning}
                </Typography>

                <Box className="flex flex-wrap gap-1">
                  {rec.keyBenefits?.map((benefit, idx) => (
                    <Chip
                      key={idx}
                      label={benefit}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>

                <Button
                  size="small"
                  variant="text"
                  className="mt-2"
                  onClick={() => onRecommendationSelect?.(rec)}
                >
                  Apply Recommendation
                </Button>
              </Box>
            ))}

            {/* Risks & Alternatives */}
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.risks && recommendations.risks.length > 0 && (
                <Box className="p-3 bg-orange-50 rounded-lg">
                  <Typography
                    variant="subtitle2"
                    className="font-medium text-orange-800 mb-2"
                  >
                    Identified Risks
                  </Typography>
                  <Box className="space-y-1">
                    {recommendations.risks.map((risk, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        className="text-orange-700 text-sm"
                      >
                        • {risk}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}

              {recommendations.alternatives &&
                recommendations.alternatives.length > 0 && (
                  <Box className="p-3 bg-purple-50 rounded-lg">
                    <Typography
                      variant="subtitle2"
                      className="font-medium text-purple-800 mb-2"
                    >
                      Alternative Strategies
                    </Typography>
                    <Box className="space-y-1">
                      {recommendations.alternatives.map((alt, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          className="text-purple-700 text-sm"
                        >
                          • {alt}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
