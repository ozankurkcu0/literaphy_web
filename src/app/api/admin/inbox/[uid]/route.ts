import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { isGmailInboxConfigured, setLeadAnswered } from "@/lib/gmail-inbox";
import { logActivity } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE =
  "Gmail gelen kutusu bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

const patchSchema = z.object({ answered: z.boolean() });

interface RouteParams {
  params: Promise<{ uid: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isGmailInboxConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { uid: uidRaw } = await params;
  const uid = Number(uidRaw);
  if (!Number.isInteger(uid) || uid <= 0) {
    return NextResponse.json({ error: "Geçersiz mail kimliği." }, { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  try {
    await setLeadAnswered(uid, parsed.data.answered);
    logActivity(
      session.name || session.phone,
      parsed.data.answered ? "Mail cevaplandı olarak işaretlendi" : "Mail cevaplanmadı olarak işaretlendi",
      `mail #${uid}`,
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/inbox/:uid] setLeadAnswered hata:", error);
    return NextResponse.json({ error: "İşaretlenemedi." }, { status: 500 });
  }
}
