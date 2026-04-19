import * as React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Package, ShoppingBag } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = React.useState(true);
  const [authed, setAuthed] = React.useState(false);

  React.useEffect(() => {
    document.title = "Admin — QalbOfSilk";
  }, []);

  React.useEffect(() => {
    let mounted = true;

    const verify = async (session: { user: { id: string } } | null) => {
      if (!mounted) return;
      if (!session) {
        setAuthed(false);
        setChecking(false);
        navigate("/admin/login");
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
        navigate("/admin/login");
        return;
      }
      setAuthed(true);
      setChecking(false);
    };

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => verify(session), 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => verify(session));

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!authed) return null;

  const isOrders = location.pathname === "/admin" || location.pathname === "/admin/";
  const isProducts = location.pathname.startsWith("/admin/products");

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 md:px-6 md:py-8">
      <div className="mb-6 flex items-center justify-between gap-3 md:mb-8">
        <h1 className="font-display text-xl md:text-3xl">Panel Admin</h1>
        <button
          onClick={logout}
          className="flex flex-shrink-0 items-center gap-2 rounded-md border border-border px-3 py-2 text-[11px] uppercase tracking-wider hover:bg-muted md:text-xs"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>

      <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-border md:mb-8 md:gap-2">
        <Link
          to="/admin"
          className={`flex-shrink-0 border-b-2 px-3 py-2 text-sm font-medium hover:text-accent md:px-4 ${
            isOrders ? "border-accent text-accent" : "border-transparent"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" /> Commandes
          </span>
        </Link>
        <Link
          to="/admin/products"
          className={`flex-shrink-0 border-b-2 px-3 py-2 text-sm font-medium hover:text-accent md:px-4 ${
            isProducts ? "border-accent text-accent" : "border-transparent"
          }`}
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
