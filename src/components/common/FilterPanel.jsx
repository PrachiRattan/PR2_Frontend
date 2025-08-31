// src/components/common/FilterPanel.jsx
import { useState, useMemo } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function FilterPanel({
  filterOptions = {},
  value = {},
  onChange,
  onApply,
  onReset,
  onSavePreset
}) {
  const [local, setLocal] = useState({
    search: value.search || "",
    certifications: value.certifications || [],
    carbonPerUnit: value.carbonPerUnit || [0, 50],
    sustainabilityScore: value.sustainabilityScore || [1, 10],
    recyclingMin: value.recyclingMin || 0,
    policies: value.policies || [],
    regions: value.regions || [],
    industries: value.industries || [],
    companySize: value.companySize || "",
    yearsInOperationMin: value.yearsInOperationMin || 0,
    kpiSortKey: value.kpiSortKey || "sustainabilityScore",
    hasNetZero: value.hasNetZero || false
  });

  const emitChange = (next) => {
    setLocal(next);
    onChange?.(next);
  };

  const certificationList = filterOptions.certifications || [];
  const industries = filterOptions.industries || [];
  const locations = filterOptions.locations || [];
  const policiesList = filterOptions.policies || [];
  const sizes = filterOptions.companySizes || ["<500", "500-1000", "1000-5000", "5000+"];

  const canApply = useMemo(() => true, [local]);

  return (
    <div className="w-full space-y-3">
      <div className="bg-white border rounded-lg p-3 shadow-sm">
        <Typography variant="subtitle2" className="text-slate-800 mb-2">
          Quick Search
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search supplier name or location"
          value={local.search}
          onChange={(e) => emitChange({ ...local, search: e.target.value })}
        />
      </div>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className="font-medium">Sustainability</Typography>
        </AccordionSummary>
        <AccordionDetails className="space-y-4">
          <div>
            <Typography variant="caption" className="text-slate-600">
              Certifications
            </Typography>
            <div className="mt-2 flex flex-wrap gap-2">
              {certificationList.map((c) => {
                const selected = local.certifications.includes(c);
                return (
                  <Chip
                    key={c}
                    label={c}
                    color={selected ? "primary" : "default"}
                    variant={selected ? "filled" : "outlined"}
                    onClick={() => {
                      const next = selected
                        ? local.certifications.filter((x) => x !== c)
                        : [...local.certifications, c];
                      emitChange({ ...local, certifications: next });
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Box>
              <Typography variant="caption" className="text-slate-600">
                Carbon per unit (kg CO2e)
              </Typography>
              <Slider
                value={local.carbonPerUnit}
                min={filterOptions.carbonFootprintRange?.[0] ?? 0}
                max={filterOptions.carbonFootprintRange?.[1] ?? 50}
                onChange={(_, v) => emitChange({ ...local, carbonPerUnit: v })}
                valueLabelDisplay="auto"
              />
            </Box>
            <Box>
              <Typography variant="caption" className="text-slate-600">
                Sustainability score
              </Typography>
              <Slider
                value={local.sustainabilityScore}
                min={1}
                max={10}
                onChange={(_, v) =>
                  emitChange({ ...local, sustainabilityScore: v })
                }
                valueLabelDisplay="auto"
              />
            </Box>
          </div>

          <Box className="flex items-center justify-between">
            <FormControlLabel
              control={
                <Switch
                  checked={local.hasNetZero}
                  onChange={(e) =>
                    emitChange({ ...local, hasNetZero: e.target.checked })
                  }
                />
              }
              label="Has Net Zero roadmap/policy"
            />
            <Box className="w-1/3">
              <Typography variant="caption" className="text-slate-600">
                Min recycling (%)
              </Typography>
              <Slider
                value={local.recyclingMin}
                min={0}
                max={100}
                onChange={(_, v) => emitChange({ ...local, recyclingMin: v })}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className="font-medium">Business</Typography>
        </AccordionSummary>
        <AccordionDetails className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Box>
              <Typography variant="caption" className="text-slate-600">
                Regions
              </Typography>
              <Select
                multiple
                fullWidth
                size="small"
                value={local.regions}
                onChange={(e) =>
                  emitChange({ ...local, regions: e.target.value })
                }
                renderValue={(selected) => (
                  <div className="flex flex-wrap gap-1">
                    {selected.map((v) => (
                      <Chip key={v} label={v} size="small" />
                    ))}
                  </div>
                )}
              >
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography variant="caption" className="text-slate-600">
                Industries
              </Typography>
              <Select
                multiple
                fullWidth
                size="small"
                value={local.industries}
                onChange={(e) =>
                  emitChange({ ...local, industries: e.target.value })
                }
                renderValue={(selected) => (
                  <div className="flex flex-wrap gap-1">
                    {selected.map((v) => (
                      <Chip key={v} label={v} size="small" />
                    ))}
                  </div>
                )}
              >
                {industries.map((ind) => (
                  <MenuItem key={ind} value={ind}>
                    {ind}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Box>
              <Typography variant="caption" className="text-slate-600">
                Company size
              </Typography>
              <Select
                fullWidth
                size="small"
                value={local.companySize}
                onChange={(e) =>
                  emitChange({ ...local, companySize: e.target.value })
                }
              >
                {sizes.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography variant="caption" className="text-slate-600">
                Min years in operation
              </Typography>
              <Slider
                value={local.yearsInOperationMin}
                min={0}
                max={50}
                onChange={(_, v) =>
                  emitChange({ ...local, yearsInOperationMin: v })
                }
                valueLabelDisplay="auto"
              />
            </Box>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className="font-medium">Policies & Sorting</Typography>
        </AccordionSummary>
        <AccordionDetails className="space-y-4">
          <div>
            <Typography variant="caption" className="text-slate-600">
              Policies
            </Typography>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-1">
              {(policiesList || []).map((p) => (
                <FormControlLabel
                  key={p}
                  control={
                    <Checkbox
                      checked={local.policies.includes(p)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const next = checked
                          ? [...local.policies, p]
                          : local.policies.filter((x) => x !== p);
                        emitChange({ ...local, policies: next });
                      }}
                    />
                  }
                  label={p}
                />
              ))}
            </div>
          </div>

          <Box>
            <Typography variant="caption" className="text-slate-600">
              Sort by (KPI)
            </Typography>
            <Select
              fullWidth
              size="small"
              value={local.kpiSortKey}
              onChange={(e) =>
                emitChange({ ...local, kpiSortKey: e.target.value })
              }
            >
              {(filterOptions.kpiSortKeys || []).map((k) => (
                <MenuItem key={k} value={k}>
                  {k}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </AccordionDetails>
      </Accordion>

      <div className="flex gap-2">
        <Button onClick={() => onReset?.()} variant="outlined" color="inherit">
          Reset
        </Button>
        <Button
          onClick={() => onSavePreset?.(local)}
          variant="outlined"
          color="primary"
        >
          Save Preset
        </Button>
        <Button
          onClick={() => onApply?.(local)}
          variant="contained"
          color="primary"
          disabled={!canApply}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
