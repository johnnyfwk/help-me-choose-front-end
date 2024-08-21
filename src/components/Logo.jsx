import { Link } from "react-router-dom";

export default function Logo({setCategory, setIsNavVisible}) {
    function handleLogo() {
        setCategory("");
        setIsNavVisible(false);
        window.scrollTo(0, 0);
    }

    return (
        <Link to="/" id="logo" onClick={handleLogo}>Help Me Choose</Link>
    )
}