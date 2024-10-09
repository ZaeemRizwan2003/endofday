import "@/styles/globals.css";
import Navbar from "@/Components/Navbar";
import { useRouter } from "next/router";
export default function App({ Component, pageProps }) {
  const router = useRouter();
  const noNavbarRoutes = ['/Login', '/Signup'];

  return (<>
    {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
    <Component {...pageProps} />;
  </>

  )
}
