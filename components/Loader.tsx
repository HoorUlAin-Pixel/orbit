import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex justify-center py-12" role="status" aria-label="Loading">
      <LoaderCircle className="size-8 animate-spin text-primary" />
    </div>
  );
}