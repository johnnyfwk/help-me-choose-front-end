import { Link } from "react-router-dom";

export default function Nav() {
    return (
        <nav>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/sign-up">Sign Up</Link>
            <Link to="/login">Login</Link>
            <Link to="/profile">Profile</Link>
        </nav>
    )
}