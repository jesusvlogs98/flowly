import { useState } from "react";
import { usePersistentNotes, useCreatePersistentNote, useUpdatePersistentNote, useDeletePersistentNote } from "@/hooks/use-persistent-notes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, StickyNote, Loader2, Save, X } from "lucide-react";

export default function NotesPage() {
  const { data: notes, isLoading } = usePersistentNotes();
  const { mutate: createNote } = useCreatePersistentNote();
  const { mutate: updateNote } = useUpdatePersistentNote();
  const { mutate: deleteNote } = useDeletePersistentNote();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleAddNote = () => {
    createNote({ title: "New Note", content: "" });
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
        <h1 className="text-3xl font-display font-bold">Notes</h1>
        <Button onClick={handleAddNote} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Note
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes?.map((note) => (
          <Card key={note.id} className="hover-elevate transition-all duration-300 relative group min-h-[250px] flex flex-col">
            {editingId === note.id ? (
              <div className="p-4 space-y-4 flex-1 flex flex-col">
                <Input 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  placeholder="Note Title"
                  className="font-bold"
                />
                <Textarea 
                  value={editContent} 
                  onChange={(e) => setEditContent(e.target.value)} 
                  placeholder="Content..."
                  className="flex-1 min-h-[150px] resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave(note.id)} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <StickyNote className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{note.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6 flex-1">
                    {note.content || "Empty note..."}
                  </p>
                  <div className="pt-4 mt-auto">
                    <Button variant="outline" size="sm" onClick={() => startEditing(note)} className="w-full">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
        {notes?.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/30">
            No notes yet. Click "Add Note" to get started.
          </div>
        )}
      </div>
    </div>
  );
}