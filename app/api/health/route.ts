export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { status: "ok", service: "casa-digital-segura", revision: process.env.APP_REVISION ?? "local" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
