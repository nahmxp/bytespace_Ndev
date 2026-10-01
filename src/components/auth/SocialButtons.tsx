"use client";

import { useState } from "react";

function Facebook() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#040819" d="M12 2a10 10 0 0 0-1.6 19.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
function Google() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#040819" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

export function SocialButtons() {
  const [note, setNote] = useState("");
  const btn = "grid h-[66px] w-[66px] place-items-center rounded-2xl border border-line bg-white transition-colors hover:border-ink";
  const notify = () => setNote("Social sign-in isn't available yet. Please use your email and password.");

  return (
    <div>
      <div className="flex items-center gap-4 text-mute">
        <span className="h-px flex-1 bg-line/70" />
        <span className="text-base">or</span>
        <span className="h-px flex-1 bg-line/70" />
      </div>
      <div className="mt-8 flex justify-center gap-5">
        <button type="button" onClick={notify} aria-label="Continue with Facebook" className={btn}>
          <Facebook />
        </button>
        <button type="button" onClick={notify} aria-label="Continue with Google" className={btn}>
          <Google />
        </button>
      </div>
      <p role="status" className="mt-3 min-h-5 text-center text-sm text-mute">
        {note}
      </p>
    </div>
  );
}
