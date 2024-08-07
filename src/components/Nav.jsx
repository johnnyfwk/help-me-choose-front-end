import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';

export default function Nav({
    user
}) {
    const { logout } = useAuth();

    return (
        <nav>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            {user
                ? <>
                    <Link to="/post-a-question">Post a Question</Link>
                    <Link to="/profile">Profile</Link>
                    <span onClick={logout} id="logout-button">Logout</span>
                </>                
                : <>
                    <Link to="/sign-up">Sign Up</Link>
                    <Link to="/login">Login</Link>
                </>
            }
        </nav>
    )
}