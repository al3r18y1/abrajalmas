import { createFileRoute } from "@tanstack/react-router";
import AbrajSite from "@/components/abraj/AbrajSite";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "أبراج الماس | حلول الشبكات والكاميرات وتقنية المعلومات في العراق" },
      { name: "description", content: "أبراج الماس — شركة عراقية متخصصة في حلول الشبكات، أنظمة المراقبة، البنية التحتية لتكنولوجيا المعلومات، البرمجيات المؤسسية، والجهد المنخفض. نخدم قطاع الأعمال منذ 2022." },
      { property: "og:title", content: "أبراج الماس — حلول التقنية المؤسسية | شبكات · كاميرات · برمجيات" },
      { property: "og:description", content: "شريكك التقني الموثوق في العراق. نقدم حلول الشبكات، أنظمة CCTV، الجهد المنخفض، البرمجيات المؤسسية، وخدمات تقنية المعلومات. احجز استشارتك اليوم." },
      { property: "og:image", content: "/assets/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ar_IQ" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "أبراج الماس — حلول التقنية المؤسسية" },
      { name: "twitter:description", content: "شريكك التقني الموثوق في العراق. شبكات، كاميرات، برمجيات، وبنية تحتية متكاملة." },
      { name: "twitter:image", content: "/assets/og-image.png" },
    ],
  }),
  component: Index,
});

function Index() {
  return <AbrajSite />;
}
