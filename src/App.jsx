import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Logo from "./components/Logo";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

function App() {
    const { user, loading } = useAuth();
    console.log("User: ", user);
    console.log("Loading? ", loading);
    
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
                    element={
                        !user
                            ? <SignUp />
                            : <Navigate to="/" />
                    }
                />

                <Route
                    path="/login"
                    element={
                        !user
                            ? <Login />
                            : <Navigate to="/" />
                    }
                />

                <Route
                    path="/profile"
                    element={
                        user
                            ? <Profile />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="*"
                    element={<Home />}
                />
            </Routes>
            <Footer />
        </>
    )
}

export default App
