import { createFileRoute } from "@tanstack/react-router";
import { CapturedPage } from "../components/CapturedPage";

export const Route = createFileRoute("/jogador/$guestId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CapturedPage base="/dp/pages/jogador-f8b4cc6a-12bb-4e72-90d6-7667093ee5b4" />;
}
