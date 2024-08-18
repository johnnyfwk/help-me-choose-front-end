import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Logo from "./components/Logo";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ResetPassword from './pages/ResetPassword';
import Question from './pages/Question';
import PostAQuestion from './pages/PostAQuestion';
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

function App() {
    const { user, loading } = useAuth();
    // console.log("User:", user);

    const [category, setCategory] = useState("");
    
    return (
        <>
            <Logo setCategory={setCategory} />
            <Nav user={user} />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home category={category} setCategory={setCategory} />
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
                    path="/reset-password"
                    element={
                        !user
                            ? <ResetPassword />
                            : <Navigate to="/" />
                    }
                />

                <Route
                    path="/question/:question_id"
                    element={
                        <Question user={user} setCategory={setCategory} />
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
                            ? <Profile user={user} setCategory={setCategory} />
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
