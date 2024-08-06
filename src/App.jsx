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
import LogoutButton from './components/LogoutButton';

function App() {
    const { user, loading } = useAuth();
    console.log(user)
    
    return (
        <>
            <Logo />
            <Nav />
            {user && <LogoutButton />}
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/sign-up"
                    element={user ? <Home /> : <SignUp />}
                />

                <Route
                    path="/login"
                    element={user ? <Home /> : <Login />}
                />

                <Route
                    path="/profile"
                    element={user ? <Profile /> : <Navigate to="/login" />}
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
