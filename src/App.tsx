import { Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { SplashIntro } from "@/components/SplashIntro";
import { Toaster } from "@/components/ui/sonner";

import IndexPage from "@/pages/Index";
import BurkinisPage from "@/pages/Burkinis";
import ContactPage from "@/pages/Contact";
import ProductPage from "@/pages/Product";
import CheckoutPage from "@/pages/Checkout";
import ThankYouPage from "@/pages/ThankYou";
import NotFoundPage from "@/pages/NotFound";

import AdminLayout from "@/pages/admin/AdminLayout";
import AdminLoginPage from "@/pages/admin/AdminLogin";
import AdminOrdersPage from "@/pages/admin/AdminOrders";
import AdminOrderDetailPage from "@/pages/admin/AdminOrderDetail";
import AdminProductsPage from "@/pages/admin/AdminProducts";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SplashIntro />
      <div className="flex min-h-screen flex-col animate-fade-in">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFab />
      </div>
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <CartProvider>
        <Routes>
          {/* Admin section — no public chrome */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
          </Route>

          {/* Public site */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <IndexPage />
              </PublicLayout>
            }
          />
          <Route
            path="/burkinis"
            element={
              <PublicLayout>
                <BurkinisPage />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <ContactPage />
              </PublicLayout>
            }
          />
          <Route
            path="/product/:slug"
            element={
              <PublicLayout>
                <ProductPage />
              </PublicLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <PublicLayout>
                <CheckoutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/thank-you/:orderNumber"
            element={
              <PublicLayout>
                <ThankYouPage />
              </PublicLayout>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <NotFoundPage />
              </PublicLayout>
            }
          />
        </Routes>
        <Toaster />
      </CartProvider>
    </I18nProvider>
  );
}
