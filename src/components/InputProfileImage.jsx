export default function InputProfileImage({
    profileImageUrl,
    handleProfileImageUrl
}) {
    return (
        <input
            type="text"
            id="profile-image-url"
            name="profile-image-url"
            value={profileImageUrl}
            onChange={handleProfileImageUrl}
            maxLength="2083"
            placeholder="Profile Image URL (optional)"
        ></input>
    )
}