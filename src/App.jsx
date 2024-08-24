import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Logo from "./components/Logo";
import NavButton from './components/NavButton';
import Nav from "./components/Nav";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ResetPassword from './pages/ResetPassword';
import Poll from './pages/Poll';
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
import Erro404 from './pages/Error404';
import CookieConsent from './components/CookieConsent';

function App() {
    const { user, loading } = useAuth();
    // console.log(user);

    const [isNavVisible, setIsNavVisible] = useState(false);

    const [category, setCategory] = useState("");
    const [homepagePollPage, setHomepagePollPage] = useState(1);

    const [isEmailVerificationSuccessMessageVisible, setIsEmailVerificationSuccessMessageVisible] = useState(false);
    const [isLoginSuccessMessageVisible, setIsLoginSuccessMessageVisible] = useState(false);

    const [isPostPollSuccessMessageVisible, setIsPostPollSuccessMessageVisible] = useState(false);
    const [isPollUpdatedSuccessMessageVisible, setIsPollUpdatedSuccessMessageVisible] = useState(false);
    const [isPollDeletedSuccessMessageVisible, setIsPollDeletedSuccessMessageVisible] = useState(false);
    
    const [isPostCommentSuccessMessageVisible, setIsPostCommentSuccessMessageVisible] = useState(false);
    const [isCommentUpdatedSuccessMessageVisible, setIsCommentUpdatedSuccessMessageVisible] = useState(false);
    const [isCommentUpdatedErrorMessageVisible, setIsCommentUpdatedErrorMessageVisible] = useState(false);
    const [isCommentDeletedSuccessMessageVisible, setIsCommentDeletedSuccessMessageVisible] = useState(false);
    const [isCommentDeletedErrorMessageVisible, setIsCommentDeletedErrorMessageVisible] = useState(false);

    const [isUpdateProfileImageSuccessMessageVisible, setIsUpdateProfileImageSuccessMessageVisible] = useState(false);
    const [isChangePasswordSuccessMessageVisible, setIsChangePasswordSuccessMessageVisible] = useState(false);
    const [isDeleteAccountSuccessMessageVisible, setIsDeleteAccountSuccessMessageVisible] = useState(false);

    const [isLogoutSuccessMessageVisible, setIsLogoutSuccessMessageVisible] = useState(false);

    const styleEmailVerificationSuccessMessage = {
        bottom: isEmailVerificationSuccessMessageVisible ? "0%" : "-100%"
    };

    const stylePostPollSuccessMessage = {
        bottom: isPostPollSuccessMessageVisible ? "0%" : "-100%"
    };

    const styleLoginSuccessMessage = {
        bottom: isLoginSuccessMessageVisible ? "0%" : "-100%"
    };

    const stylePostCommentSuccessMessage = {
        bottom: isPostCommentSuccessMessageVisible ? "0%" : "-100%"
    };

    const stylePollUpdatedSuccessMessage = {
        bottom: isPollUpdatedSuccessMessageVisible ? "0%" : "-100%"
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

    const stylePollDeletedSuccessMessage = {
        bottom: isPollDeletedSuccessMessageVisible ? "0%" : "-100%"
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

    const styleLogoutSuccessMessage = {
        bottom: isLogoutSuccessMessageVisible ? "0%" : "-100%"
    }

    return (
        <>
            <Logo setCategory={setCategory} setIsNavVisible={setIsNavVisible} />

            <NavButton isNavVisible={isNavVisible} setIsNavVisible={setIsNavVisible} />

            <Nav
                user={user}
                isNavVisible={isNavVisible}
                setIsNavVisible={setIsNavVisible}
                setIsLogoutSuccessMessageVisible={setIsLogoutSuccessMessageVisible}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            user={user}
                            category={category}
                            setCategory={setCategory}
                            homepagePollPage={homepagePollPage}
                            setHomepagePollPage={setHomepagePollPage}
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
                    path="/poll/:poll_id"
                    element={
                        <Poll
                            user={user}
                            setCategory={setCategory}
                            setHomepagePollPage={setHomepagePollPage}
                            setIsPostCommentSuccessMessageVisible={setIsPostCommentSuccessMessageVisible}
                            setIsPollUpdatedSuccessMessageVisible={setIsPollUpdatedSuccessMessageVisible}
                            setIsCommentUpdatedSuccessMessageVisible={setIsCommentUpdatedSuccessMessageVisible}
                            setIsCommentUpdatedErrorMessageVisible={setIsCommentUpdatedErrorMessageVisible}
                            setIsCommentDeletedSuccessMessageVisible={setIsCommentDeletedSuccessMessageVisible}
                            setIsCommentDeletedErrorMessageVisible={setIsCommentDeletedErrorMessageVisible}
                            setIsPollDeletedSuccessMessageVisible={setIsPollDeletedSuccessMessageVisible}
                        />
                    }
                />

                <Route
                    path="/create-a-poll"
                    element={
                        user
                            ? <CreateAPoll
                                user={user}
                                setIsPostPollSuccessMessageVisible={setIsPostPollSuccessMessageVisible}
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
                    element={<About user={user} />}
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
                    element={<Erro404 />}
                />
            </Routes>
            
            <Footer user={user} />

            <CookieConsent />

            <div className="message-box success email-verification" style={styleEmailVerificationSuccessMessage}>Verification Email Sent</div>
            <div className="message-box success login" style={styleLoginSuccessMessage}>You have logged in successfully</div>

            <div className="message-box success post-poll" style={stylePostPollSuccessMessage}>Your poll has been created</div>
            <div className="message-box success poll-updated" style={stylePollUpdatedSuccessMessage}>Your poll has been updated</div>
            <div className="message-box success poll-deleted" style={stylePollDeletedSuccessMessage}>Your poll has been deleted</div>
            
            <div className="message-box success post-comment" style={stylePostCommentSuccessMessage}>Your comment has been posted</div>            
            <div className="message-box success comment-updated" style={styleCommentUpdatedSuccessMessage}>Your comment has been updated</div>
            <div className="message-box error comment-updated" style={styleCommentUpdatedErrorMessage}>Your comment could not be updated</div>
            <div className="message-box success comment-deleted" style={styleCommentDeletedSuccessMessage}>Your comment was deleted</div>
            <div className="message-box error comment-deleted" style={styleCommentDeletedErrorMessage}>Your comment could not be deleted</div>

            <div className="message-box success update-profile-image" style={styleUpdateProfileImageSuccessMessage}>Your profile image has been updated</div>
            <div className="message-box success change-password" style={styleChangePasswordSuccessMessage}>Your password has been changed</div>
            <div className="message-box success delete-account" style={styleDeleteAccountSuccessMessage}>Your account has been deleted</div>

            <div className="message-box success logout" style={styleLogoutSuccessMessage}>You have logged out successfully</div>
        </>
    )
}

export default App
