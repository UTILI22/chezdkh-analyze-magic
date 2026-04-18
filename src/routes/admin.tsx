import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import * as React from "react";
import { LogOut, Package, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — QalbOfSilk" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = React.useState(true);
  const [authed, setAuthed] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const verify = async (session: { user: { id: string } } | null) => {
      if (!mounted) return;
      if (!session) {
        setAuthed(false);
        setChecking(false);
        navigate({ to: "/admin/login" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      if (!mounted) return;
      const isAdmin = (roles ?? []).some((r) => r.role === "admin");
      if (!isAdmin) {
        await supabase.auth.signOut();
        setAuthed(false);
        setChecking(false);
        navigate({ to: "/admin/login" });
        return;
      }
      setAuthed(true);
      setChecking(false);
    };

    // 1. Set up listener FIRST
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer to avoid deadlocks
      setTimeout(() => verify(session), 0);
    });

    // 2. Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => verify(session));

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Panel Admin</h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs uppercase tracking-wider hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>

      <nav className="mb-8 flex gap-2 border-b border-border">
        <Link
          to="/admin"
          activeOptions={{ exact: true }}
          activeProps={{ className: "border-accent text-accent" }}
          className="border-b-2 border-transparent px-4 py-2 text-sm font-medium hover:text-accent"
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" /> Commandes
          </span>
        </Link>
        <Link
          to="/admin/products"
          activeProps={{ className: "border-accent text-accent" }}
          className="border-b-2 border-transparent px-4 py-2 text-sm font-medium hover:text-accent"
        >
          <span className="inline-flex items-center gap-2">
            <Package className="h-4 w-4" /> Produits
          </span>
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}
