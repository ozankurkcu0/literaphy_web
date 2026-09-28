import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCalismaProgramSession } from "@/lib/calisma-program-session-guard";
import { createStudyPlaylist, isSheetsConfigured, listStudyPlaylists } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE = "Google Sheets bağlantısı henüz yapılandırılmamış.";

const inputSchema = z.object({
  courseName: z.string().optional().default(""),
  title: z.string().min(1, "Başlık gerekli."),
  url: z.string().optional().default(""),
  totalVideos: z.number().int().min(0).optional().default(0),
  watchedVideos: z.number().int().min(0).optional().default(0),
  done: z.boolean().optional().default(false),
});

export async function GET() {
  const authorized = await requireCalismaProgramSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const playlists = await listStudyPlaylists();
    return NextResponse.json({ playlists, configured: true });
  } catch (error) {
    console.error("[api/calisma-program/playlistler] listStudyPlaylists hata:", error);
    return NextResponse.json({ error: "Playlistler alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authorized = await requireCalismaProgramSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const json = await request.json().catch(() => null);
  const parsed = inputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const playlist = await createStudyPlaylist(parsed.data);
    return NextResponse.json({ playlist }, { status: 201 });
  } catch (error) {
    console.error("[api/calisma-program/playlistler] createStudyPlaylist hata:", error);
    const message = error instanceof Error ? error.message : "Playlist oluşturulamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
