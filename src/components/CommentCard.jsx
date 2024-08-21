import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as utils from '../../utils';
import InputComment from './InputComment';
import { db } from '../firebase';
import {
    doc,
    updateDoc,
    serverTimestamp,
    deleteDoc
} from 'firebase/firestore';

export default function CommentCard({
    commentObject,
    page,
    user,
    updateComment,
    comment,
    setComment,
    isEditingPoll,
    setIsEditingPoll,
    editingCommentId,
    setEditingCommentId,
    setComments,
    isEditingProfileImage,
    setIsEditingProfileImage,
    isChangingPassword,
    setIsChangingPassword,
    isDeletingAccount,
    setIsDeletingAccount,
    setIsCommentUpdatedSuccessMessageVisible,
    setIsCommentUpdatedErrorMessageVisible,
    setIsCommentDeletedSuccessMessageVisible,
    setIsCommentDeletedErrorMessageVisible,
    setCommentsPage,
    setTotalComments
}) {
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [originalComment, setOriginalComment] = useState("");
    const [isConfirmDeleteCommentVisible, setIsConfirmDeleteCommentVisible] = useState(false);

    useEffect(() => {
        if (comment || isEditingPoll || isEditingProfileImage || isChangingPassword || isDeletingAccount) {
            setIsEditingComment(false);
        }
        if (editingCommentId !== commentObject.id) {
            setIsEditingComment(false);
        }
    }, [comment, isEditingPoll, editingCommentId, isEditingProfileImage, isChangingPassword, isDeletingAccount])

    function handleEditCommentButton() {
        setEditingCommentId(commentObject.id)
        setIsEditingComment(true);
        setOriginalComment(commentObject.comment);
        setIsEditingPoll(false);
        setComment("");
        setIsEditingProfileImage(false);
        setIsChangingPassword(false);
        setIsDeletingAccount(false);
    }

    function handleCancelEditComment() {
        setIsEditingComment(false);
    }

    function handleUpdateComment() {
        const docRef = doc(db, 'comments', commentObject.id);
        updateDoc(docRef, {
            comment: originalComment,
            commentModified: serverTimestamp()
        })
        .then(() => {
            setIsCommentUpdatedSuccessMessageVisible(true);
            setTimeout(() => {
                setIsCommentUpdatedSuccessMessageVisible(false);
            }, 3000);
            setIsEditingComment(false);
            const updatedComment = {...commentObject, comment: originalComment};
            updateComment(updatedComment);
        })
        .catch((error) => {
            setIsCommentUpdatedErrorMessageVisible(true);
            setTimeout(() => {
                setIsCommentUpdatedErrorMessageVisible(false);
            }, 3000);
        });
    }

    function handleDeleteComment() {
        setIsEditingComment(false);
        setIsConfirmDeleteCommentVisible(true);
    }

    function handleEditComment(event) {
        let updatedComment = event.target.value;
        setOriginalComment(updatedComment);
    }

    function handleDeleteCommentNo() {
        setIsConfirmDeleteCommentVisible(false);
    }

    function handleDeleteCommentYes() {
        setIsConfirmDeleteCommentVisible(false);
        deleteDoc(doc(db, "comments", editingCommentId))
            .then(() => {
                setIsCommentDeletedSuccessMessageVisible(true);
                setTimeout(() => {
                    setIsCommentDeletedSuccessMessageVisible(false);
                }, 3000);
                setCommentsPage(1);
                setTotalComments((currentTotalComments) => currentTotalComments - 1);
                setComments((currentComments) => {
                    const updatedComments = currentComments.filter((comment) => {
                        return comment.id !== editingCommentId;
                    })
                    return updatedComments;
                })
            })
            .catch((error) => {
                setIsCommentDeletedErrorMessageVisible(true);
                setTimeout(() => {
                    setIsCommentDeletedErrorMessageVisible(false);
                }, 3000);
            })
    }

    function handleLikeComment() {
        const updatedCommentObject = structuredClone(commentObject);
        if (!updatedCommentObject.commentLikes.includes(user.uid)) {
            updatedCommentObject.commentLikes.push(user.uid);
            updatedCommentObject.commentModified = serverTimestamp();
        } else {
            const updatedLikes = updatedCommentObject.commentLikes.filter((userId) => userId !== user.uid);
            updatedCommentObject.commentLikes = updatedLikes;
        }

        const docRef = doc(db, 'comments', commentObject.id);
        updateDoc(docRef, {
            commentLikes: updatedCommentObject.commentLikes,
            commentModified: serverTimestamp()
        })
        .then(() => {
            updateComment(updatedCommentObject);
        })
        .catch((error) => {
            console.error(error.message);
        });
    }

    function handleCommentCardLink() {
        window.scrollTo(0, 0);
    }

    return (
        <div className="comment-card-wrapper">
            <div>
                <Link to={`/profile/${commentObject.commentOwnerId}`} onClick={handleCommentCardLink}>
                    <div className="comment-card-user-image-wrapper">
                        <img
                            src={commentObject.commentOwnerImageUrl}
                            alt={`Profile image of ${commentObject.commentOwnerUsername}`}
                            className="comment-card-user-image"
                        />
                    </div>
                </Link>
            </div>

            <div className="comment-card-details">
                {page === "profile"
                    ? <Link to={`/poll/${commentObject.pollId}`}>{commentObject.pollTitle}</Link>
                    : null
                }

                {page === "poll"
                    ? <div className="comment-card-username">
                        <Link
                            to={`/profile/${commentObject.commentOwnerId}`}
                            onClick={handleCommentCardLink}
                        >{commentObject.commentOwnerUsername}</Link>
                    </div>
                    : null
                }

                {isEditingComment
                    ? <InputComment
                        comment={originalComment}
                        handleComment={handleEditComment}
                    />
                    : <div>{commentObject.comment}</div>
                }

                {!user
                    ? <div className="like-comment-user-not-verified">&#128077;{commentObject.commentLikes.length}</div>
                    : user.emailVerified && page === "poll" && user.uid !== commentObject.commentOwnerId
                        ? <div onClick={handleLikeComment}><span className="like-comment-user-verified">&#128077;</span>{commentObject.commentLikes.length}</div>
                        : null
                }

                <div className="comment-card-created-date">{utils.formatDate(commentObject.commentCreated)}</div>
                
                {user &&
                user.emailVerified &&
                commentObject.commentOwnerId === user.uid &&
                !isEditingComment &&
                !isConfirmDeleteCommentVisible
                    ? <button
                        onClick={handleEditCommentButton}
                    >Edit</button>
                    : null
                }
                
                {isEditingComment
                    ? <div>
                        <button onClick={handleCancelEditComment}>Cancel</button>
                        <button onClick={handleUpdateComment} disabled={!originalComment}>Update</button>
                        <button onClick={handleDeleteComment}>Delete</button>
                    </div>
                    : null
                }

                {isConfirmDeleteCommentVisible
                    ? <div>
                        <div className="confirm">Delete comment?</div>
                        <button onClick={handleDeleteCommentNo}>No</button>
                        <button onClick={handleDeleteCommentYes}>Yes</button>
                    </div>                
                    : null
                }
            </div>
        </div>
    )
}