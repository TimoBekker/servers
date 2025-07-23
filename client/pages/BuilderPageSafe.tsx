import { BuilderSafe } from "@/components/BuilderSafe";
import { useParams } from "react-router-dom";

export default function BuilderPageSafe() {
  const params = useParams();
  const path = params["*"] || "";

  return <BuilderSafe urlPath={`/${path}`} />;
}
