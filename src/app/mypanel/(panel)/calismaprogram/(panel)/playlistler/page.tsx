import type { Metadata } from "next";
import { PlaylistTracker } from "@/components/calisma-program/PlaylistTracker";

export const metadata: Metadata = {
  title: "Ders Playlistleri",
  robots: { index: false, follow: false },
};

export default function CalismaProgramPlaylistlerPage() {
  return <PlaylistTracker />;
}
