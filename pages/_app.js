import "@/styles/globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { CartProvider } from "./Customer/cartcontext";
export default function App({ Component, pageProps }) {

  return (<>
    {/* <Navbar /> */}
    <CartProvider>
      <Component {...pageProps} />;
      <Footer />
    </CartProvider>
  </>


  )
}
