import { createFileRoute } from "@tanstack/react-router";
import { CapturedPage } from "../components/CapturedPage";

export const Route = createFileRoute("/amigos")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CapturedPage base="/dp/pages/amigos" />;
}
