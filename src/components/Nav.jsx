import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';

export default function Nav({user}) {
    const { logout } = useAuth();

    return (
        <nav>
            {user && user.emailVerified
                ? <Link to="/post-a-question">Post a Question</Link>
                : null
            }

            {user
                ? <>
                    <Link to={`/profile/${user.uid}`}>Profile</Link>
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