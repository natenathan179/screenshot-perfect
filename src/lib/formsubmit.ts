// All site forms are delivered by FormSubmit to this inbox.
// Replace with the business inbox; the first submission triggers a one-time activation email from FormSubmit.
export const FORM_EMAIL = "support@peptidelabs.com";

export async function submitForm(subject: string, fields: Record<string, string | number>) {
  const res = await fetch(`https://formsubmit.co/ajax/${FORM_EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ _subject: subject, _template: "table", _captcha: "false", ...fields }),
  });
  const json = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  if (!res.ok || String(json.success) === "false") throw new Error(json.message || "Submission failed");
  return json;
}
