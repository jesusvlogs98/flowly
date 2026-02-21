import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, X, StickyNote, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function NotesPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => apiRequest("GET", "/api/notes"),
  });

  const createNote = useMutation({
    mutationFn: () => apiRequest("POST", "/api/notes", { title: t("notes.titlePlaceholder"), content: "" }),
    onSuccess: (note) => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      setEditingId(note.id);
      setEditTitle("");
      setEditContent("");
    },
  });

  const updateNote = useMutation({
    mutationFn: ({ id, title, content }: { id: number; title: string; content: string }) =>
      apiRequest("PATCH", `/api/notes/${id}`, { title, content }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["notes"] }); setEditingId(null); },
  });

  const deleteNote = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/notes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  const startEdit = (note: any) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("notes.title")}</h1>
          <p className="text-muted-foreground text-sm">{notes.length} {notes.length === 1 ? "note" : "notes"}</p>
        </div>
        <Button onClick={() => createNote.mutate()} className="gap-2">
          <Plus className="w-4 h-4" />
          {t("notes.add")}
        </Button>
      </div>

      {notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <StickyNote className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">{t("notes.empty")}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note: any) => (
          <Card key={note.id} className="transition-all hover:shadow-md">
            {editingId === note.id ? (
              <CardContent className="p-4 space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder={t("notes.titlePlaceholder")}
                  className="font-semibold"
                  autoFocus
                />
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder={t("notes.contentPlaceholder")}
                  className="min-h-[140px] resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1" onClick={() => updateNote.mutate({ id: note.id, title: editTitle, content: editContent })}>
                    <Save className="w-3 h-3" />
                    {t("notes.save")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm flex items-start justify-between gap-2">
                    <span className="truncate">{note.title || t("notes.titlePlaceholder")}</span>
                    <Button
                      variant="ghost" size="icon"
                      className="h-6 w-6 shrink-0 text-destructive hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); deleteNote.mutate(note.id); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className="px-4 pb-4 cursor-pointer"
                  onClick={() => startEdit(note)}
                >
                  <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap min-h-[60px]">
                    {note.content || <span className="italic">{t("notes.contentPlaceholder")}</span>}
                  </p>
                  {note.updatedAt && (
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      {format(new Date(note.updatedAt), "MMM d, yyyy")}
                    </p>
                  )}
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
