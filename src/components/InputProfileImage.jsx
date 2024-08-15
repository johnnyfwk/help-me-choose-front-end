export default function InputProfileImage({
    profileImageUrl,
    handleProfileImageUrl
}) {
    return (
        <div>
            <label
                htmlFor="profile-image-url"
            >Profile Image URL (optional)</label>

            <input
                type="text"
                id="profile-image-url"
                name="profile-image-url"
                value={profileImageUrl}
                onChange={handleProfileImageUrl}
                maxLength="2083"
                placeholder="Profile Image URL"
                required
            ></input>
        </div>
        
    )
}