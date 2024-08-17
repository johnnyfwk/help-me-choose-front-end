import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Logo from "./components/Logo";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Question from './pages/Question';
import PostAQuestion from './pages/PostAQuestion';
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

function App() {
    const { user, loading } = useAuth();
    console.log("User:", user);
    
    return (
        <>
            <Logo />
            <Nav
                user={user}
            />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home />
                    }
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
                    path="/question/:question_id"
                    element={
                        <Question user={user} />
                    }
                />

                <Route
                    path="/post-a-question"
                    element={
                        user
                            ? <PostAQuestion user={user} />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/profile/:profile_id"
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
