import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, updateDoc, getCountFromServer, limit, startAfter } from 'firebase/firestore';
import { deleteUser, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import PollCard from '../components/PollCard';
import CommentCard from '../components/CommentCard';
import InputProfileImage from '../components/InputProfileImage';
import InputPassword from '../components/InputPassword';
import * as utils from '../../utils';

export default function Profile({
    user,
    setCategory,
    setIsCommentUpdatedSuccessMessageVisible,
    setIsCommentUpdatedErrorMessageVisible,
    setIsCommentDeletedSuccessMessageVisible,
    setIsCommentDeletedErrorMessageVisible,
    setIsUpdateProfileImageSuccessMessageVisible,
    setIsChangePasswordSuccessMessageVisible,
    setIsDeleteAccountSuccessMessageVisible
}) {
    const {profile_id} = useParams(null);

    const navigate = useNavigate();

    const [userProfile, setUserProfile] = useState(null);
    const [getUserProfileError, setGetUserProfileError] = useState("");

    const [polls, setPolls] = useState([]);
    const [comments, setComments] = useState([]);

    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [isEditingPoll, setIsEditingPoll] = useState(false);

    const [isEditingProfileImage, setIsEditingProfileImage] = useState(false);
    const [originalProfileImageUrl, setOriginalProfileImageUrl] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [updateProfileImageError, setUpdateProfileImageError] = useState("");

    const [resendVerificationEmailMessage, setResendVerificationEmailMessage] = useState("");

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [changePasswordError, setChangePasswordError] = useState("");

    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [deleteAccountError, setDeleteAccountError] = useState("");

    const cardsPerPage = 1;

    const [isFetchingPolls, setIsFetchingPolls] = useState(false);
    const [pollsPage, setPollsPage] = useState(1);
    const [totalPolls, setTotalPolls] = useState(0);
    const totalPollPages = Math.ceil(totalPolls / cardsPerPage);   
    const [fetchPollsMessage, setFetchPollsMessage] = useState("");

    const [isFetchingComments, setIsFetchingComments] = useState(false);
    const [commentsPage, setCommentsPage] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const totalCommentPages = Math.ceil(totalComments / cardsPerPage);
    const [fetchCommentsMessage, setFetchCommentsMessage] = useState("");

    useEffect(() => {
        setPollsPage(1);
        setCommentsPage(1);

        const fetchUserProfile = () => {
            const userQuery = query(
                collection(db, 'users'),
                where('userId', '==', profile_id)
            );

            getDocs(userQuery)
                .then((userSnapshot) => {
                    const userData = userSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setUserProfile(userData);
                    setGetUserProfileError("");
                })
                .catch((error) => {
                    setGetUserProfileError("User profile could not be retrieved.");
                });
        };

        const fetchNumberOfPolls = () => {
            const pollsRef = collection(db, 'polls');
            const pollsQuery = query(pollsRef, where("pollOwnerId", "==", profile_id));
            utils.getDocumentCount(getCountFromServer, pollsQuery, setTotalPolls);
        };

        const fetchNumberOfComments = () => {
            const commentRef = collection(db, "comments");
            const commentsQuery = query(commentRef, where("commentOwnerId", "==", profile_id));
            utils.getDocumentCount(getCountFromServer, commentsQuery, setTotalComments);
        }

        fetchUserProfile();
        fetchNumberOfPolls();
        fetchNumberOfComments();
    }, [profile_id])

    // Fetch polls
    useEffect(() => {
        utils.fetchPaginatedDocuments(
            setIsFetchingPolls,
            collection,
            db,
            'polls',
            pollsPage,
            query,
            profile_id,
            profile_id,
            where,
            "pollOwnerId",
            orderBy,
            'pollModified',
            limit,
            cardsPerPage,
            getDocs,
            startAfter,
            setPolls,
            setFetchPollsMessage,
        );
    }, [pollsPage])

    // Fetch comments
    useEffect(() => {
        utils.fetchPaginatedDocuments(
            setIsFetchingComments,
            collection,
            db,
            'comments',
            commentsPage,
            query,
            profile_id,
            profile_id,
            where,
            "commentOwnerId",
            orderBy,
            'commentCreated',
            limit,
            cardsPerPage,
            getDocs,
            startAfter,
            setComments,
            setFetchCommentsMessage,
        );
    }, [commentsPage])

    function updateComment(updatedComment) {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === updatedComment.id ? updatedComment : comment
            )
        );
    }

    function handleChangeProfileImage() {
        setIsEditingProfileImage(true);
        setOriginalProfileImageUrl(userProfile[0].photoURL);
        setProfileImageUrl(userProfile[0].photoURL);
        setChangePasswordError("");
        setUpdateProfileImageError("");
        setDeleteAccountError("");
    }

    function handleCancelChangeProfileImage() {
        setIsEditingProfileImage(false);
        setProfileImageUrl(originalProfileImageUrl);
        setUpdateProfileImageError("");
    }

    function handleUpdateProfileImage() {
        const profileImageUrlTrimmed = profileImageUrl.trim();

        const validateProfileImage = profileImageUrlTrimmed
            ? utils.validateImageUrl(profileImageUrlTrimmed)
            : Promise.resolve(true);

        validateProfileImage
            .then((isValid) => {
                if (!isValid) {
                    setUpdateProfileImageError("Profile image URL is not valid.");
                    throw new Error("Profile image URL is not valid.");                    
                }
                return updateProfile(user, {photoURL: profileImageUrlTrimmed});
            })
            .then(() => {
                const pollsRef = collection(db, 'polls');
                const q = query(pollsRef, where("pollOwnerId", "==", user.uid));
                return getDocs(q);
            })
            .then((querySnapshot) => {
                const batchUpdates = [];
                querySnapshot.forEach((docSnapshot) => {
                    const docRef = doc(db, 'polls', docSnapshot.id);    
                    const updatePromise = updateDoc(docRef, {
                        pollOwnerImageUrl: profileImageUrlTrimmed,
                    });    
                    batchUpdates.push(updatePromise);
                });
            })
            .then(() => {
                const pollsRef = collection(db, "comments");
                const q = query(pollsRef, where("commentOwnerId", "==", user.uid));
                return getDocs(q);
            })
            .then((querySnapshot) => {
                const batchUpdates = [];
                querySnapshot.forEach((docSnapshot) => {
                    const docRef = doc(db, "comments", docSnapshot.id);    
                    const updatePromise = updateDoc(docRef, {
                        commentOwnerImageUrl: profileImageUrlTrimmed,
                    });    
                    batchUpdates.push(updatePromise);
                });
            })
            .then((response) => {
                const docRef = doc(db, 'users', userProfile[0].id);
                return updateDoc(docRef, {
                    photoURL: profileImageUrlTrimmed
                })
            })
            .then((response) => {
                setIsUpdateProfileImageSuccessMessageVisible(true);
                setTimeout(() => {
                    setIsUpdateProfileImageSuccessMessageVisible(false);
                }, 3000);
                setUserProfile((prevUserProfile) => [
                    { ...prevUserProfile[0], photoURL: profileImageUrlTrimmed },
                ]);
                setIsEditingProfileImage(false);
            })
            .catch((error) => {
                setUpdateProfileImageError("Your profile image could not be updated.");
            })
    }

    function handleProfileImageUrl(event) {
        setProfileImageUrl(event.target.value);
        setUpdateProfileImageError("");
    }

    function handleDeleteAccount() {
        setIsEditingProfileImage(false);
        setIsDeletingAccount(true);
        setChangePasswordError("");
        setUpdateProfileImageError("");
        setDeleteAccountError("");
    }

    function handleDeleteAccountNo() {
        setIsDeletingAccount(false);
    }

    function handleDeleteAccountYes() {
        setIsDeletingAccount(false);
        const usersQuery = query(
            collection(db, 'users'),
            where('userId', '==', user.uid)
        );

        const pollsQuery = query(
            collection(db, 'polls'),
            where('pollOwnerId', '==', user.uid)
        );

        const commentsQuery = query(
            collection(db, 'comments'),
            where('commentOwnerId', '==', user.uid)
        );

        getDocs(commentsQuery)
            .then((commentsSnapshot) => {
                const deleteCommentPromises = commentsSnapshot.docs.map((commentDoc) => {
                    return deleteDoc(commentDoc.ref);
                });
                return Promise.all(deleteCommentPromises);
            })
            .then((response) => {
                console.log(response)
                return getDocs(pollsQuery);
            })
            .then((pollsSnapshot) => {
                const deletePollsPromises = pollsSnapshot.docs.map((pollDoc) => {
                    return deleteDoc(pollDoc.ref);
                });
                return Promise.all(deletePollsPromises);
            })
            .then((response) => {
                console.log(response)
                return getDocs(usersQuery);
            })
            .then((usersSnapshot) => {
                const deleteUsersPromises = usersSnapshot.docs.map((userDoc) => {
                    return deleteDoc(userDoc.ref);
                });
                return Promise.all(deleteUsersPromises);
            })
            .then((response) => {
                console.log(response)
                return deleteUser(user);
            })
            .then(() => {
                setIsDeleteAccountSuccessMessageVisible(true);
                setTimeout(() => {
                    setIsDeleteAccountSuccessMessageVisible(false);
                }, 3000);
                setDeleteAccountError("");
                navigate('/');
            })
            .catch((error) => {
                console.log(error)
                setDeleteAccountError("Your account could not be deleted.");
            });
    }

    function handleResendVerificationEmail() {
        sendEmailVerification(user)
            .then(() => {
                setResendVerificationEmailMessage("Verification email has been sent.");                
            })
            .catch((error) => {
                setResendVerificationEmailMessage("Verification email could not be sent.");  
            });
    }

    function handleChangePassword() {
        setIsChangingPassword(true);
        setChangePasswordError("");
        setUpdateProfileImageError("");
        setDeleteAccountError("");
    }

    function handleCurrentPassword(event) {
        setCurrentPassword(event.target.value)
    }

    function handleNewPassword(event) {
        setNewPassword(event.target.value)
    }

    function handleCancelChangePassword() {
        setIsChangingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
    }

    function handleConfirmChangePassword() {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        reauthenticateWithCredential(user, credential)
            .then((response) => {
                return updatePassword(user, newPassword);
            })
            .then((response) => {
                setIsChangePasswordSuccessMessageVisible(true);
                setTimeout(() => {
                    setIsChangePasswordSuccessMessageVisible(false);
                }, 3000);
                setChangePasswordError("");
                setCurrentPassword("");
                setNewPassword("");
                setIsChangingPassword(false);
            })
            .catch((error) => {
                if (error.code === "auth/invalid-credential") {
                    setChangePasswordError("The password you entered is incorrect.");
                } else {
                    setChangePasswordError("Your password could not be changed.");
                }                
            })
    }

    const handlePollPageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPollPages) {
            setPollsPage(newPage);
        }
    };

    const handleCommentPageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalCommentPages) {
            setCommentsPage(newPage);
        }
    };

    function handlePollCardCategory(category) {
        setCategory(category);
    }

    if (!userProfile) {
        return null;
    }

    if (getUserProfileError) {
        return <div className="error">{getUserProfileError}</div>
    }

    return (
        <>
            <Helmet>
                <meta name="robots" content="noindex, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/" />
                <title>Profile: {userProfile[0].displayName} • HelpMeChoose.uk</title>                
                <meta name="description" content={`Profile of ${userProfile[0].displayName} on HelpMeChoose.uk.`} />
            </Helmet>

            <header>
                <div aria-label="breadcrumb">
                    <div><Link to="/">Home</Link> &gt; Profile</div>
                </div>
            </header>

            <main>
                <section>
                    <div id="profile-image-wrapper">
                        <img src={userProfile[0].photoURL} alt={`Profile image of ${userProfile[0].displayName}`} id="profile-image"/>
                    </div>
                    
                    <h1>{userProfile[0].displayName}</h1>

                    <div className="error">{deleteAccountError}</div>
                    <div className="error">{updateProfileImageError}</div>
                    <div className="error">{changePasswordError}</div>                    

                    {user && profile_id === user.uid && !user.emailVerified
                        ? <>
                            <p>Your email address has not been verified. Please check your email and verify it to create polls and comments, vote on other members' polls, and edit your profile.</p>
                            <p>If you can't see the email in your Inbox, it may appear in your spam folder.</p>
                            <p>Once you have verified your account, refresh the page to gain full access to features.</p>
                            <div>{resendVerificationEmailMessage}</div>
                            <button onClick={handleResendVerificationEmail}>Resend Verification Email</button>
                        </>
                        : null
                    }
                    
                    {isEditingProfileImage
                        ? <InputProfileImage
                            profileImageUrl={profileImageUrl}
                            handleProfileImageUrl={handleProfileImageUrl}
                        />
                        : null
                    }

                    {user.emailVerified &&
                    user.uid === userProfile[0].userId &&
                    !isEditingProfileImage &&
                    !isDeletingAccount &&
                    !isChangingPassword
                        ? <div>
                            <button onClick={handleChangeProfileImage}>Change Profile Image</button>
                            <button onClick={handleChangePassword}>Change Password</button>
                            <button onClick={handleDeleteAccount}>Delete Account</button>
                        </div>
                        : null
                    }
                    
                    {isEditingProfileImage
                        ? <div>
                            <button onClick={handleCancelChangeProfileImage}>Cancel</button>
                            <button onClick={handleUpdateProfileImage}>Update</button>
                        </div>
                        : null
                    }

                    {isChangingPassword
                        ? <div>
                            <InputPassword
                                id={"current-password"}
                                password={currentPassword}
                                handlePassword={handleCurrentPassword}
                                placeholder={"Current Password"}
                            />
                            <InputPassword
                                id={"new-password"}
                                password={newPassword}
                                handlePassword={handleNewPassword}
                                placeholder={"New Password"}
                            />
                            <button onClick={handleCancelChangePassword}>Cancel</button>
                            <button onClick={handleConfirmChangePassword}>Confirm</button>
                        </div>
                        : null
                    }

                    {isDeletingAccount
                        ? <div>
                            <div className="confirm">Delete account? Your polls and comments will be deleted permanently.</div>
                            <button onClick={handleDeleteAccountNo}>No</button>
                            <button onClick={handleDeleteAccountYes}>Yes</button>
                        </div>
                        : null
                    }

                    <h2>Polls</h2>

                    <div className="error">{fetchPollsMessage}</div>

                    {polls.length > 0
                        ? <>
                            <div className="poll-cards-wrapper">
                                {polls.map((poll, index) => {
                                    return (
                                        <PollCard
                                            key={index}
                                            poll={poll}
                                            page="profile"
                                            handlePollCardCategory={handlePollCardCategory}
                                        />
                                    )
                                })}
                            </div>
                            <div>
                                <button onClick={() => handlePollPageChange(pollsPage - 1)} disabled={isFetchingPolls || pollsPage === 1}>Previous</button>
                                <span>Page {pollsPage} of {totalPollPages}</span>
                                <button onClick={() => handlePollPageChange(pollsPage + 1)} disabled={isFetchingPolls || pollsPage === totalPollPages}>Next</button>
                            </div>
                        </>
                        : profile_id === user.uid
                            ? <p>You haven't created any polls yet.</p>
                            : <p>This user hasn't created any polls yet.</p>
                    }
                </section>
                
                <section>
                    <h2>Comments</h2>

                    <div className="error">{fetchCommentsMessage}</div>

                    {comments.length > 0
                        ? <>
                            <div className="comments-wrapper">
                                {comments.map((commentObject, index) => {
                                    return (
                                        <CommentCard
                                            key={index}
                                            commentObject={commentObject}
                                            page="profile"
                                            user={user}
                                            updateComment={updateComment}
                                            comment={comment}
                                            setComment={setComment}
                                            isEditingPoll={isEditingPoll}
                                            setIsEditingPoll={setIsEditingPoll}
                                            editingCommentId={editingCommentId}
                                            setEditingCommentId={setEditingCommentId}
                                            setComments={setComments}
                                            isEditingProfileImage={isEditingProfileImage}
                                            setIsEditingProfileImage={setIsEditingProfileImage}
                                            isChangingPassword={isChangingPassword}
                                            setIsChangingPassword={setIsChangingPassword}
                                            isDeletingAccount={isDeletingAccount}
                                            setIsDeletingAccount={setIsDeletingAccount}
                                            setIsCommentUpdatedSuccessMessageVisible={setIsCommentUpdatedSuccessMessageVisible}
                                            setIsCommentUpdatedErrorMessageVisible={setIsCommentUpdatedErrorMessageVisible}
                                            setIsCommentDeletedSuccessMessageVisible={setIsCommentDeletedSuccessMessageVisible}
                                            setIsCommentDeletedErrorMessageVisible={setIsCommentDeletedErrorMessageVisible}
                                            setCommentsPage={setCommentsPage}
                                            setTotalComments={setTotalComments}
                                        />
                                    )
                                })}
                            </div>
                            <div>
                                <button onClick={() => handleCommentPageChange(commentsPage - 1)} disabled={isFetchingComments || commentsPage === 1}>Previous</button>
                                <span>Page {commentsPage} of {totalCommentPages}</span>
                                <button onClick={() => handleCommentPageChange(commentsPage + 1)} disabled={isFetchingComments || commentsPage === totalCommentPages}>Next</button>
                            </div>
                        </>
                        : profile_id === user.uid
                            ? <p>You haven't posted any comments yet.</p>
                            : <p>This user hasn't posted any comments yet.</p>
                    }
                </section>
            </main>
        </>
    )
}