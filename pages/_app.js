import "@/styles/globals.css";
import Footer from "@/Components/Footer";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const CartProvider = dynamic(
  () => import("./Customer/cartcontext").then((mod) => mod.CartProvider),
  {
    ssr: false,
  }
);

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isExcludedRoute =
    router.pathname.startsWith("/Admin") ||
    router.pathname.startsWith("/Restaurants");
  // ||
  // router.pathname.startsWith("/Delivery");

  return (
    <>
      {isExcludedRoute ? (
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
