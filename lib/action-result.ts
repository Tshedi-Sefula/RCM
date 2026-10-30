// What admin Server Actions return to their forms. `fieldErrors` is keyed
// by input name so each message can sit under its field.
export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<string, string>> };
