export default function NavButton({isNavVisible, setIsNavVisible}) {
    function handleNavButton() {
        setIsNavVisible((currentVisibility) => !currentVisibility);
    }

    const styleNavButton = {
        transform: isNavVisible ? "rotate(-225deg)" : "rotate(0deg)"
    };

    return (
        <div id="nav-button" onClick={handleNavButton} style={styleNavButton}>
            <div></div>
            <div></div>
        </div>
    )
}