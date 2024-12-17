import "@/styles/globals.css";
import Footer from "@/Components/Footer";
import { CartProvider } from "./Customer/cartcontext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/Admin");

  return (
    <>
      {isAdminRoute ? (
        <Component {...pageProps} />
      ) : (
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </CartProvider>
      )}
    </>
  );
}
