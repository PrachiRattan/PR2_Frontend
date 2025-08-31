// src/components/dashboard/ProductCards.jsx
import { useMemo, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

const impactOf = (sustainabilityScore) => {
  if (sustainabilityScore >= 8.2)
    return { label: "High Impact", color: "success" };
  if (sustainabilityScore >= 7.5)
    return { label: "Medium Impact", color: "warning" };
  return { label: "Low Impact", color: "default" };
};

const ProductCard = ({ product, supplierName, image }) => {
  const impact = impactOf(product.sustainabilityScore);
  return (
    <Card elevation={0} className="rounded-xl border overflow-hidden">
      {image && (
        <CardMedia
          component="img"
          image={image}
          height="140"
          alt={product.name}
        />
      )}
      <CardContent className="p-4">
        <Typography
          variant="subtitle1"
          className="font-semibold text-slate-900"
        >
          {product.name}
        </Typography>
        <Typography variant="caption" className="text-slate-500">
          {product.category}
        </Typography>
        <div className="mt-2 flex items-center gap-2">
          <Chip size="small" color={impact.color} label={impact.label} />
          {supplierName && (
            <Chip size="small" variant="outlined" label={supplierName} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProductCards({ products = [], suppliers = [] }) {
  const [filter, setFilter] = useState("All");
  const withSupplier = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        supplierName:
          suppliers.find((s) => s.id === p.currentSupplierId)?.name || "",
      })),
    [products, suppliers]
  );

  const filtered = useMemo(() => {
    if (filter === "All") return withSupplier;
    return withSupplier.filter((p) => {
      const tag = impactOf(p.sustainabilityScore).label;
      return tag.startsWith(filter);
    });
  }, [filter, withSupplier]);

  const filters = ["All", "High", "Medium", "Low"];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <Chip
            key={f}
            label={`${f}${f !== "All" ? " Impact" : ""}`}
            color={filter === f ? "primary" : "default"}
            variant={filter === f ? "filled" : "outlined"}
            onClick={() => setFilter(f)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            supplierName={p.supplierName}
            image={`/assets/product-placeholders/${p.id % 4}.jpg`}
          />
        ))}
      </div>
    </div>
  );
}
