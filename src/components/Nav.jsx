import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';

export default function Nav({user, isNavVisible, setIsNavVisible}) {
    const { logout } = useAuth();

    function handleNav() {
        setIsNavVisible(false);
        window.scrollTo(0, 0);
    }

    const styleNav = {
        left: isNavVisible ? "0%" : "100%"
    };

    return (
        <nav id="nav-main" style={styleNav} onClick={handleNav}>
            {user && user.emailVerified
                ? <div>
                    <Link to="/create-a-poll">Create a Poll</Link>
                </div>
                : null
            }

            {user
                ? <>
                    <div>
                        <Link to={`/profile/${user.uid}`}>Profile</Link>
                    </div>
                    <div>
                        <span onClick={logout} id="logout-button">Logout</span>
                    </div>
                </>
                : <>
                    <div>
                        <Link to="/sign-up">Sign Up</Link>
                    </div>
                    <div>
                        <Link to="/login">Login</Link>
                    </div>
                </>
            }

            <div id="nav-about">
                <Link to="/about">About</Link>
            </div>

            <div id="nav-contact">
                <Link to="/contact">Contact</Link>
            </div>
        </nav>
    )
}