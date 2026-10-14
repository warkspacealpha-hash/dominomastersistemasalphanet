import { createFileRoute } from "@tanstack/react-router";
import { CapturedPage } from "../../components/CapturedPage";

export const Route = createFileRoute("/jogar/duplas")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CapturedPage base="/dp/pages/jogar-duplas" />;
}
