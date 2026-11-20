// The email sign-up forms: the Subscribe menu and each silo's own box.
// Placeholder: there's no newsletter service yet, so nothing is sent.

const BAD_EMAIL = 'That email address doesn’t look right.';
const NOT_LIVE = 'Thanks! Sign-ups aren’t live yet, so nothing was sent.';

/** Wire a form with an email box and a .signup-note. `check` can veto first. */
export function wireSignup(form: HTMLFormElement, check?: () => string | undefined) {
  const note = form.querySelector<HTMLElement>('.signup-note')!;
  const email = form.querySelector<HTMLInputElement>('input[type="email"]')!;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const problem = check?.();
    if (problem) {
      note.textContent = problem;
    } else if (!email.checkValidity()) {
      note.textContent = BAD_EMAIL;
      email.focus();
    } else {
      // TODO: send the email and new FormData(form).getAll('list') to the
      // newsletter service once one is chosen.
      note.textContent = NOT_LIVE;
    }
  });
}
