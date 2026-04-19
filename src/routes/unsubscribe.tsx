import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/unsubscribe")({
  head: () => ({
    meta: [
      { title: "Désabonnement — QalbOfSilk" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: UnsubscribePage,
});

type State =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "already" }
  | { status: "invalid" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

function UnsubscribePage() {
  const [state, setState] = React.useState<State>({ status: "loading" });
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setState({ status: "invalid" });
      return;
    }
    setToken(t);
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) setState({ status: "ready" });
        else if (data.reason === "already_unsubscribed") setState({ status: "already" });
        else setState({ status: "invalid" });
      })
      .catch(() => setState({ status: "invalid" }));
  }, []);

  const onConfirm = async () => {
    if (!token) return;
    setState({ status: "submitting" });
    try {
      const res = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) setState({ status: "success" });
      else if (data.reason === "already_unsubscribed") setState({ status: "already" });
      else setState({ status: "error", message: data.error || "Une erreur est survenue." });
    } catch (e) {
      setState({ status: "error", message: e instanceof Error ? e.message : "Erreur réseau" });
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      {state.status === "loading" && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Vérification du lien...</p>
        </>
      )}

      {state.status === "ready" && (
        <>
          <h1 className="font-display text-3xl">Confirmer le désabonnement</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Vous ne recevrez plus aucun email de QalbOfSilk.
          </p>
          <button
            onClick={onConfirm}
            className="mt-6 rounded-md bg-foreground px-6 py-3 text-xs font-medium uppercase tracking-wider text-background hover:opacity-90"
          >
            Me désabonner
          </button>
          <Link to="/" className="mt-3 text-xs text-muted-foreground underline">
            Annuler
          </Link>
        </>
      )}

      {state.status === "submitting" && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Traitement...</p>
        </>
      )}

      {state.status === "success" && (
        <>
          <CheckCircle2 className="h-12 w-12 text-accent" />
          <h1 className="mt-4 font-display text-3xl">Désabonnement confirmé</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Vous ne recevrez plus d'emails de notre part.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-md border border-border px-6 py-3 text-xs uppercase tracking-wider hover:bg-muted"
          >
            Retour à l'accueil
          </Link>
        </>
      )}

      {state.status === "already" && (
        <>
          <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 font-display text-3xl">Déjà désabonné</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Cette adresse n'est plus inscrite à nos emails.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-md border border-border px-6 py-3 text-xs uppercase tracking-wider hover:bg-muted"
          >
            Retour à l'accueil
          </Link>
        </>
      )}

      {state.status === "invalid" && (
        <>
          <XCircle className="h-12 w-12 text-destructive" />
          <h1 className="mt-4 font-display text-3xl">Lien invalide</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Ce lien de désabonnement n'est pas valide ou a expiré.
          </p>
        </>
      )}

      {state.status === "error" && (
        <>
          <XCircle className="h-12 w-12 text-destructive" />
          <h1 className="mt-4 font-display text-3xl">Erreur</h1>
          <p className="mt-3 text-sm text-muted-foreground">{state.message}</p>
        </>
      )}
    </div>
  );
}
