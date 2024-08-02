import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer>
            <div className="footer-links">
                <div>HelpMeChoose.uk</div>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </div>
            <div id="copyright">Copyright &copy; {new Date().getFullYear()} HelpMeChoose.uk. All Rights Reserved.</div>
        </footer>
    )
}