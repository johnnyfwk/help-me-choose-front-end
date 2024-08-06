import { Routes, Route } from "react-router-dom";
import Logo from "./components/Logo";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

function App() {
    return (
        <>
            <Logo />
            <Nav />
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/sign-up"
                    element={<SignUp />}
                />
                <Route
                    path="/about"
                    element={<About />}
                />
                <Route
                    path="/contact"
                    element={<Contact />}
                />
            </Routes>
            <Footer />
        </>
    )
}

export default App
