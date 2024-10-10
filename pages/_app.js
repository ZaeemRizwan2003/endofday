import "@/styles/globals.css";
import Footer from "@/Components/Footer";
import { CartProvider } from "./Customer/cartcontext";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
