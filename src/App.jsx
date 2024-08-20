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
import CreateAPoll from './pages/CreateAPoll';
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import CommunityGuidelines from './pages/CommunityGuidelines';
import Disclaimer from './pages/Disclaimer';
import Footer from "./components/Footer";

function App() {
    const { user, loading } = useAuth();

    const [category, setCategory] = useState("");
    const [homepageQuestionPage, setHomepageQuestionPage] = useState(1);

    const [isEmailVerificationSuccessMessageVisible, setIsEmailVerificationSuccessMessageVisible] = useState(false);
    const [isLoginSuccessMessageVisible, setIsLoginSuccessMessageVisible] = useState(false);

    const [isPostQuestionSuccessMessageVisible, setIsPostQuestionSuccessMessageVisible] = useState(false);
    const [isQuestionUpdatedSuccessMessageVisible, setIsQuestionUpdatedSuccessMessageVisible] = useState(false);
    const [isQuestionDeletedSuccessMessageVisible, setIsQuestionDeletedSuccessMessageVisible] = useState(false);
    
    const [isPostCommentSuccessMessageVisible, setIsPostCommentSuccessMessageVisible] = useState(false);
    const [isCommentUpdatedSuccessMessageVisible, setIsCommentUpdatedSuccessMessageVisible] = useState(false);
    const [isCommentUpdatedErrorMessageVisible, setIsCommentUpdatedErrorMessageVisible] = useState(false);
    const [isCommentDeletedSuccessMessageVisible, setIsCommentDeletedSuccessMessageVisible] = useState(false);
    const [isCommentDeletedErrorMessageVisible, setIsCommentDeletedErrorMessageVisible] = useState(false);

    const [isUpdateProfileImageSuccessMessageVisible, setIsUpdateProfileImageSuccessMessageVisible] = useState(false);
    const [isChangePasswordSuccessMessageVisible, setIsChangePasswordSuccessMessageVisible] = useState(false);
    const [isDeleteAccountSuccessMessageVisible, setIsDeleteAccountSuccessMessageVisible] = useState(false);

    const styleEmailVerificationSuccessMessage = {
        bottom: isEmailVerificationSuccessMessageVisible ? "0%" : "-100%"
    };

    const stylePostQuestionSuccessMessage = {
        bottom: isPostQuestionSuccessMessageVisible ? "0%" : "-100%"
    };

    const styleLoginSuccessMessage = {
        bottom: isLoginSuccessMessageVisible ? "0%" : "-100%"
    };

    const stylePostCommentSuccessMessage = {
        bottom: isPostCommentSuccessMessageVisible ? "0%" : "-100%"
    };

    const styleQuestionUpdatedSuccessMessage = {
        bottom: isQuestionUpdatedSuccessMessageVisible ? "0%" : "-100%"
    };

    const styleCommentUpdatedSuccessMessage = {
        bottom: isCommentUpdatedSuccessMessageVisible ? "0%" : "-100%"
    };

    const styleCommentUpdatedErrorMessage = {
        bottom: isCommentUpdatedErrorMessageVisible ? "0%" : "-100%"
    };

    const styleCommentDeletedSuccessMessage = {
        bottom: isCommentDeletedSuccessMessageVisible ? "0%" : "-100%"
    };

    const styleCommentDeletedErrorMessage = {
        bottom: isCommentDeletedErrorMessageVisible ? "0%" : "-100%"
    };

    const styleQuestionDeletedSuccessMessage = {
        bottom: isQuestionDeletedSuccessMessageVisible ? "0%" : "-100%"
    };

    const styleUpdateProfileImageSuccessMessage = {
        bottom: isUpdateProfileImageSuccessMessageVisible ? "0%" : "-100%"
    };

    const styleChangePasswordSuccessMessage = {
        bottom: isChangePasswordSuccessMessageVisible ? "0%" : "-100%"
    };

    const styleDeleteAccountSuccessMessage = {
        bottom: isDeleteAccountSuccessMessageVisible ? "0%" : "-100%"
    };

    return (
        <>
            <Logo setCategory={setCategory} />

            <Nav user={user} />

            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            category={category}
                            setCategory={setCategory}
                            homepageQuestionPage={homepageQuestionPage}
                            setHomepageQuestionPage={setHomepageQuestionPage}
                        />
                    }
                />

                <Route
                    path="/sign-up"
                    element={
                        !user
                            ? <SignUp
                                setIsEmailVerificationSuccessMessageVisible={setIsEmailVerificationSuccessMessageVisible}
                            />
                            : <Navigate to="/" />
                    }
                />

                <Route
                    path="/login"
                    element={
                        !user
                            ? <Login setIsLoginSuccessMessageVisible={setIsLoginSuccessMessageVisible} />
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
                        <Question
                            user={user}
                            setCategory={setCategory}
                            setHomepageQuestionPage={setHomepageQuestionPage}
                            setIsPostCommentSuccessMessageVisible={setIsPostCommentSuccessMessageVisible}
                            setIsQuestionUpdatedSuccessMessageVisible={setIsQuestionUpdatedSuccessMessageVisible}
                            setIsCommentUpdatedSuccessMessageVisible={setIsCommentUpdatedSuccessMessageVisible}
                            setIsCommentUpdatedErrorMessageVisible={setIsCommentUpdatedErrorMessageVisible}
                            setIsCommentDeletedSuccessMessageVisible={setIsCommentDeletedSuccessMessageVisible}
                            setIsCommentDeletedErrorMessageVisible={setIsCommentDeletedErrorMessageVisible}
                            setIsQuestionDeletedSuccessMessageVisible={setIsQuestionDeletedSuccessMessageVisible}
                        />
                    }
                />

                <Route
                    path="/create-a-poll"
                    element={
                        user
                            ? <CreateAPoll
                                user={user}
                                setIsPostQuestionSuccessMessageVisible={setIsPostQuestionSuccessMessageVisible}
                            />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/profile/:profile_id"
                    element={
                        user
                            ? <Profile
                                user={user}
                                setCategory={setCategory}
                                setIsCommentUpdatedSuccessMessageVisible={setIsCommentUpdatedSuccessMessageVisible}
                                setIsCommentUpdatedErrorMessageVisible={setIsCommentUpdatedErrorMessageVisible}
                                setIsCommentDeletedSuccessMessageVisible={setIsCommentDeletedSuccessMessageVisible}
                                setIsCommentDeletedErrorMessageVisible={setIsCommentDeletedErrorMessageVisible}
                                setIsUpdateProfileImageSuccessMessageVisible={setIsUpdateProfileImageSuccessMessageVisible}
                                setIsChangePasswordSuccessMessageVisible={setIsChangePasswordSuccessMessageVisible}
                                setIsDeleteAccountSuccessMessageVisible={setIsDeleteAccountSuccessMessageVisible}
                            />
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
                    path="/terms-of-service"
                    element={<TermsOfService />}
                />

                <Route
                    path="/privacy-policy"
                    element={<PrivacyPolicy />}
                />

                <Route
                    path="/cookie-policy"
                    element={<CookiePolicy />}
                />

                <Route
                    path="/community-guidelines"
                    element={<CommunityGuidelines />}
                />

                <Route
                    path="/disclaimer"
                    element={<Disclaimer />}
                />

                <Route
                    path="*"
                    element={<Home />}
                />
            </Routes>
            
            <Footer user={user} />

            <div className="message-box success email-verification" style={styleEmailVerificationSuccessMessage}>Verification Email Sent</div>
            <div className="message-box success login" style={styleLoginSuccessMessage}>You have logged in successfully</div>

            <div className="message-box success post-question" style={stylePostQuestionSuccessMessage}>Your question has been posted</div>
            <div className="message-box success question-updated" style={styleQuestionUpdatedSuccessMessage}>Your question has been updated</div>
            <div className="message-box success question-deleted" style={styleQuestionDeletedSuccessMessage}>Your question has been deleted</div>
            
            <div className="message-box success post-comment" style={stylePostCommentSuccessMessage}>Your comment has been posted</div>            
            <div className="message-box success comment-updated" style={styleCommentUpdatedSuccessMessage}>Your comment has been updated</div>
            <div className="message-box error comment-updated" style={styleCommentUpdatedErrorMessage}>Your comment could not be updated</div>
            <div className="message-box success comment-deleted" style={styleCommentDeletedSuccessMessage}>Your comment was deleted</div>
            <div className="message-box error comment-deleted" style={styleCommentDeletedErrorMessage}>Your comment could not be deleted</div>

            <div className="message-box success update-profile-image" style={styleUpdateProfileImageSuccessMessage}>Your profile image has been updated</div>
            <div className="message-box success change-password" style={styleChangePasswordSuccessMessage}>Your password has been changed</div>
            <div className="message-box success delete-account" style={styleDeleteAccountSuccessMessage}>Your account has been deleted</div>
        </>
    )
}

export default App
