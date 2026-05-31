import { createFileRoute } from "@tanstack/react-router";
import AbrajSite from "@/components/abraj/AbrajSite";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ABRAJ ALMAS — Network, Computers, Cameras | شركة أبراج الماس" },
      { name: "description", content: "ABRAJ ALMAS provides enterprise networking, CCTV, low-voltage systems, IT infrastructure, enterprise software, and technical consulting in Iraq since 2022." },
      { property: "og:title", content: "ABRAJ ALMAS — Enterprise Technology & Network Solutions" },
      { property: "og:description", content: "Networking, CCTV, low-voltage systems, enterprise software, IT equipment, and technical consulting. Book a consultation today." },
    ],
  }),
  component: Index,
});

function Index() {
  return <AbrajSite />;
}
