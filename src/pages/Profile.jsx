import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteUser, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import QuestionCard from '../components/QuestionCard';
import CommentCard from '../components/CommentCard';
import InputProfileImage from '../components/InputProfileImage';
import InputPassword from '../components/InputPassword';
import * as utils from '../../utils';

export default function Profile() {
    const { user, loading } = useAuth();
    // console.log("User:", user)

    const {profile_id} = useParams(null);

    const [userProfile, setUserProfile] = useState(null);
    const [getUserProfileError, setGetUserProfileError] = useState("");

    const [questions, setQuestions] = useState([]);
    const [comments, setComments] = useState([]);
    const [getQuestionsError, setGetQuestionsError] = useState("");

    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);

    const [isEditingProfileImage, setIsEditingProfileImage] = useState(false);
    const [originalProfileImageUrl, setOriginalProfileImageUrl] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [changeProfileImageUrlMessage, setChangeProfileImageUrlMessage] = useState("");

    const [resendVerificationEmailMessage, setResendVerificationEmailMessage] = useState("");

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [changePasswordMessage, setChangePasswordMessage] = useState("");

    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [deleteAccountError, setDeleteAccountError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = () => {
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
                    console.error("Error fetching user profile: ", error);
                    setGetUserProfileError("User profile could not be retrieved.");
                });
        };

        const fetchQuestions = () => {
            const questionsQuery = query(
                collection(db, 'questions'),
                where('questionOwnerId', '==', profile_id),
                orderBy('questionCreated', 'desc')
            );

            getDocs(questionsQuery)
                .then((questionsSnapshot) => {
                    const questionsData = questionsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    const questionsOrdered = utils.sortQuestions(questionsData);
                    setQuestions(questionsOrdered);
                    setGetQuestionsError("");
                })
                .catch((error) => {
                    console.error("Error fetching questions: ", error);
                    setGetQuestionsError("Questions could not be retrieved.");
                });
        };

        const fetchComments = () => {
            const commentsQuery = query(
                collection(db, 'comments'),
                where('commentOwnerId', '==', profile_id),
                orderBy('commentCreated', 'desc')
            );

            getDocs(commentsQuery)
                .then((commentsSnapshot) => {
                    const commentsData = commentsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setComments(commentsData);
                })
                .catch((error) => {
                    console.error("Error fetching comments: ", error);
                    setDeleteAccountError("Account could not be deleted.");
                });
        };

        fetchUser();
        fetchQuestions();
        fetchComments();    
    }, [profile_id])

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
        setChangePasswordMessage(false);
        setChangeProfileImageUrlMessage(false);
    }

    function handleCancelChangeProfileImage() {
        setIsEditingProfileImage(false);
        setProfileImageUrl(originalProfileImageUrl);
        setChangeProfileImageUrlMessage("");
    }

    function handleUpdateProfileImage() {
        const profileImageUrlTrimmed = profileImageUrl.trim();

        const validateProfileImage = profileImageUrlTrimmed
            ? utils.validateImageUrl(profileImageUrlTrimmed)
            : Promise.resolve(true);

        validateProfileImage
            .then((isValid) => {
                if (!isValid) {
                    setChangeProfileImageUrlMessage("Profile image URL is not valid.");
                    throw new Error("Profile image URL is not valid.");                    
                }
                return updateProfile(user, {photoURL: profileImageUrlTrimmed});
            })
            .then(() => {
                const questionsRef = collection(db, "questions");
                const q = query(questionsRef, where("questionOwnerId", "==", user.uid));
                return getDocs(q);
            })
            .then((querySnapshot) => {
                const batchUpdates = [];
                querySnapshot.forEach((docSnapshot) => {
                    const docRef = doc(db, "questions", docSnapshot.id);    
                    const updatePromise = updateDoc(docRef, {
                        questionOwnerImageUrl: profileImageUrlTrimmed,
                    });    
                    batchUpdates.push(updatePromise);
                });
            })
            .then(() => {
                const questionsRef = collection(db, "comments");
                const q = query(questionsRef, where("commentOwnerId", "==", user.uid));
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
                setUserProfile((prevUserProfile) => [
                    { ...prevUserProfile[0], photoURL: profileImageUrlTrimmed },
                ]);
                setIsEditingProfileImage(false);
                setChangeProfileImageUrlMessage("Your profile image has been successfully changed.")
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function handleProfileImageUrl(event) {
        setProfileImageUrl(event.target.value);
        setChangeProfileImageUrlMessage("");
    }

    function handleDeleteAccount() {
        setIsEditingProfileImage(false);
        setIsDeletingAccount(true);
        setChangePasswordMessage(false);
        setChangeProfileImageUrlMessage(false);
    }

    function handleDeleteAccountNo() {
        setIsDeletingAccount(false);
    }

    function handleDeleteAccountYes() {
        const usersQuery = query(
            collection(db, 'users'),
            where('userId', '==', user.uid)
        );

        const questionsQuery = query(
            collection(db, 'questions'),
            where('questionOwnerId', '==', user.uid)
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
                return getDocs(questionsQuery);
            })
            .then((questionsSnapshot) => {
                const deleteQuestiondsPromises = questionsSnapshot.docs.map((questionDoc) => {
                    return deleteDoc(questionDoc.ref);
                });
                return Promise.all(deleteQuestiondsPromises);
            })
            .then((response) => {
                return getDocs(usersQuery);
            })
            .then((usersSnapshot) => {
                const deleteUsersPromises = usersSnapshot.docs.map((userDoc) => {
                    return deleteDoc(userDoc.ref);
                });
                return Promise.all(deleteUsersPromises);
            })
            .then((response) => {
                return deleteUser(user);
            })
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
            });
    }

    function handleResendVerificationEmail() {
        sendEmailVerification(user)
            .then(() => {
                console.log("Verification email resent.");
                setResendVerificationEmailMessage("Verification email has been sent.");                
            })
            .catch((error) => {
                console.error("Error resending verification email:", error);
                setResendVerificationEmailMessage("Verification email could not be sent.");  
            });
    }

    function handleChangePassword() {
        setIsChangingPassword(true);
        setChangePasswordMessage(false);
        setChangeProfileImageUrlMessage(false);
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
                console.log(response);
                return updatePassword(user, newPassword);
            })
            .then((response) => {
                console.log(response);
                console.log("Password updated successfully.");
                setChangePasswordMessage("Your password has been changed successfully.");
                setCurrentPassword("");
                setNewPassword("");
                setIsChangingPassword(false);
            })
            .catch((error) => {
                console.log(error.code)
                if (error.code === "auth/invalid-credential") {
                    setChangePasswordMessage("The password you entered is incorrect.");
                } else {
                    setChangePasswordMessage("Your password could not be changed.");
                }                
            })
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
                <meta name="robots" content="noindex, nofollow" />
                <link rel="canonical" href="https://helpmechoose.uk/" />
                <title>Profile: {userProfile[0].displayName} • HelpMeChoose.uk</title>                
                <meta name="description" content="User's profile on HelpMeChoose.uk." />
            </Helmet>

            <main>
                <section>
                    <div id="profile-image-wrapper">
                        <img src={userProfile[0].photoURL} alt={`Profile image of ${userProfile[0].displayName}`} id="profile-image"/>
                    </div>
                    
                    <h1>{userProfile[0].displayName}</h1>

                    <div className="error">{deleteAccountError}</div>
                    <div>{changeProfileImageUrlMessage}</div>
                    <div>{changePasswordMessage}</div>
                    

                    {user && profile_id === user.uid && !user.emailVerified
                        ? <>
                            <p>Your email address has not been verified. Please check your email and verify it to post questions and comments, vote on other members' questions, and edit your profile.</p>
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
                            <div className="confirm">Delete profile? Your account, questions, and comments will be permanently deleted.</div>
                            <button onClick={handleDeleteAccountNo}>No</button>
                            <button onClick={handleDeleteAccountYes}>Yes</button>
                        </div>
                        : null
                    }

                    <h2>Questions</h2>

                    <div className="error">{getQuestionsError}</div>

                    {questions.length > 0
                        ? <div className="question-cards-wrapper">
                            {questions.map((question, index) => {
                                return <QuestionCard key={index} question={question} page="profile" />
                            })}
                        </div>
                        : profile_id === user.uid
                            ? <p>You haven't posted any questions yet.</p>
                            : <p>This user hasn't posted any questions yet.</p>
                    }
                </section>
                
                <section>
                    <h2>Comments</h2>

                    {comments.length > 0
                        ? <div className="comments-wrapper">
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
                                        isEditingQuestion={isEditingQuestion}
                                        setIsEditingQuestion={setIsEditingQuestion}
                                        editingCommentId={editingCommentId}
                                        setEditingCommentId={setEditingCommentId}
                                        setComments={setComments}
                                        isEditingProfileImage={isEditingProfileImage}
                                        setIsEditingProfileImage={setIsEditingProfileImage}
                                        isChangingPassword={isChangingPassword}
                                        setIsChangingPassword={setIsChangingPassword}
                                        isDeletingAccount={isDeletingAccount}
                                        setIsDeletingAccount={setIsDeletingAccount}
                                    />
                                )
                            })}
                        </div>
                        : profile_id === user.uid
                            ? <p>You haven't posted any comments yet.</p>
                            : <p>This user hasn't posted any comments yet.</p>
                    }
                </section>
            </main>
        </>
    )
}