import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePersistentNotes, useCreatePersistentNote, useUpdatePersistentNote, useDeletePersistentNote } from "@/hooks/use-persistent-notes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, Save, X } from "lucide-react";

export default function NotesPage() {
  const { t } = useTranslation();
  const { data: notes, isLoading } = usePersistentNotes();
  const { mutate: createNote } = useCreatePersistentNote();
  const { mutate: updateNote } = useUpdatePersistentNote();
  const { mutate: deleteNote } = useDeletePersistentNote();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleAddNote = () => {
    createNote({ title: t("notes.new_note"), content: "" });
  };

  const startEditing = (note: any) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSave = (id: number) => {
    updateNote({ id, title: editTitle, content: editContent });
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">{t("notes.title")}</h1>
        <Button onClick={handleAddNote} className="gap-2">
          <Plus className="w-4 h-4" />
          {t("notes.add")}
        </Button>
      </div>

      {notes?.length === 0 && (
        <p className="text-muted-foreground text-center py-12 italic">{t("notes.empty")}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes?.map((note) => (
          <Card key={note.id} className="hover-elevate transition-all duration-300">
            {editingId === note.id ? (
              <CardContent className="p-4 space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-semibold"
                />
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[120px] resize-none"
                  placeholder={t("notes.content_placeholder")}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave(note.id)} className="gap-1">
                    <Save className="w-3 h-3" />
                    {t("notes.save")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="gap-1">
                    <X className="w-3 h-3" />
                    {t("notes.cancel")}
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="truncate">{note.title || t("notes.untitled")}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:text-destructive"
                      onClick={() => deleteNote({ id: note.id })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className="cursor-pointer"
                  onClick={() => startEditing(note)}
                >
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                    {note.content || <span className="italic">{t("notes.content_placeholder")}</span>}
                  </p>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
