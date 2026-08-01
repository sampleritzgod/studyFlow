import { Button } from "@/components/button";
import { Field } from "@/components/field";

type NoteEditorFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  formKey?: string;
  noteId?: string;
  title?: string;
  content?: string;
  submitLabel: string;
  cancelHref?: string;
};

export function NoteEditorForm({
  action,
  formKey,
  noteId,
  title = "",
  content = "",
  submitLabel,
  cancelHref,
}: NoteEditorFormProps) {
  return (
    <form key={formKey} className="note-form" action={action}>
      {noteId ? <input type="hidden" name="noteId" value={noteId} /> : null}
      <Field label="Title" name="title" required maxLength={200} defaultValue={title} />
      <Field label="Content" name="content" as="textarea" rows={noteId ? 14 : 12} defaultValue={content} />
      <div className="action-row">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        {cancelHref ? (
          <Button href={cancelHref} variant="secondary">
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
