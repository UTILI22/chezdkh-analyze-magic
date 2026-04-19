import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [adminExists, setAdminExists] = React.useState<boolean | null>(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    document.title = "Admin — QalbOfSilk";
    supabase.rpc("admin_exists").then(({ data }) => {
      const exists = Boolean(data);
      setAdminExists(exists);
      if (!exists) setMode("signup");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin");
    });
  }, [navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (adminExists) {
          toast.error("Un admin existe déjà. Connexion uniquement.");
          setMode("login");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Compte admin créé ! Connectez-vous.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/admin");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="font-display text-3xl">Panel Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Créez le compte administrateur (premier accès)"
              : "Connectez-vous pour accéder au panel"}
          </p>
        </div>

        <form onSubmit={handle} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider">Email</label>
            <input
              required
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider">Mot de passe</label>
            <input
              required
              type="password"
              minLength={8}
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium uppercase tracking-wider text-background hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "..." : mode === "signup" ? "Créer le compte admin" : "Se connecter"}
          </button>

          {!adminExists && mode === "login" && (
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              Pas encore de compte ? Créer le premier admin
            </button>
          )}
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
