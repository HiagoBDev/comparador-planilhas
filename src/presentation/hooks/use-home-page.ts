import { useNavigate } from "react-router-dom";
import { useComparisonStore } from "@/application/store/comparison-store";
import { toast } from "sonner";

export function useHomePage() {
  const comparisons = useComparisonStore((s) => s.comparisons);
  const createComparison = useComparisonStore((s) => s.createComparison);
  const deleteComparison = useComparisonStore((s) => s.deleteComparison);
  const navigate = useNavigate();

  const handleCreate = async (description: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const id = createComparison(description);
    navigate(`/comparison/${id}`);
    toast.success("Comparação criada com sucesso! ");
  };

  const handleDelete = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    deleteComparison(id);
    toast.success("Comparação removida com sucesso!");
  };

  return {
    comparisons,
    handleCreate,
    handleDelete,
  };
}
