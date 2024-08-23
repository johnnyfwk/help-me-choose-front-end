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
    setTotalComments,
    setIsConfirmDeletePollVisible
}) {
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [originalComment, setOriginalComment] = useState("");
    const [isConfirmDeleteCommentVisible, setIsConfirmDeleteCommentVisible] = useState(false);

    const truncatedCommentLength = 300;
    const [fullComment, setFullComment] = useState("");
    const [isCommentTooLong, setIsCommentTooLong] = useState(false);
    const [truncatedComment, setTruncatedComment] = useState("");
    const [commentBeforeEditing, setCommentBeforeEditing] = useState("");
    const [isShowMoreButtonVisible, setIsShowMoreButtonVisible] = useState(false);
    const [isCommentExpanded, setIsCommentExpanded] = useState(false);
    const [commentToDisplay, setCommentToDisplay] = useState("");

    useEffect(() => {
        if (comment || isEditingPoll || isEditingProfileImage || isChangingPassword || isDeletingAccount) {
            setIsEditingComment(false);
            setCommentToDisplay(truncatedComment);
            setIsCommentExpanded(false);
            setIsConfirmDeleteCommentVisible(false);
            setIsShowMoreButtonVisible(true);
        }
        if (editingCommentId !== commentObject.id) {
            setIsEditingComment(false);
            setIsConfirmDeleteCommentVisible(false);
            setIsShowMoreButtonVisible(true);
            setCommentToDisplay(truncatedComment);
            setIsCommentExpanded(false);
        }
    }, [comment, isEditingPoll, editingCommentId, isEditingProfileImage, isChangingPassword, isDeletingAccount])

    useEffect(() => {
        setFullComment(commentObject.comment);

        let displayedComment;

        if (commentObject.comment.length > truncatedCommentLength) {
            setIsCommentTooLong(true);
            setIsShowMoreButtonVisible(true);
            displayedComment = commentObject.comment.slice(0, truncatedCommentLength) + "...";
            setTruncatedComment(displayedComment);
        } else {
            setIsCommentTooLong(false);
            setIsShowMoreButtonVisible(false);
            displayedComment = commentObject.comment.slice(0, truncatedCommentLength);
            setTruncatedComment(displayedComment);
        }

        setCommentToDisplay(displayedComment);
    }, [commentObject.comment, page])

    function handleEditCommentButton() {
        setEditingCommentId(commentObject.id)
        setIsEditingComment(true);
        setOriginalComment(commentObject.comment);
        setIsEditingPoll(false);
        setComment("");
        setIsEditingProfileImage(false);
        setIsChangingPassword(false);
        setIsDeletingAccount(false);
        setIsShowMoreButtonVisible(false);
        setCommentBeforeEditing(commentToDisplay);
        setCommentToDisplay(truncatedComment);
        setIsConfirmDeletePollVisible(false);
    }

    function handleCancelEditComment() {
        setIsEditingComment(false);
        setIsShowMoreButtonVisible(true);
        setCommentToDisplay(commentBeforeEditing);
        setIsCommentExpanded(false);
        setCommentToDisplay(truncatedComment);
    }

    function handleUpdateComment() {
        setIsCommentExpanded(false);
        setIsShowMoreButtonVisible(true);

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
        setIsShowMoreButtonVisible(false);
        setIsCommentExpanded(false);
        setCommentToDisplay(truncatedComment);
    }

    function handleEditComment(event) {
        let updatedComment = event.target.value;
        setOriginalComment(updatedComment);
        setComment("");
    }

    function handleDeleteCommentNo() {
        setIsConfirmDeleteCommentVisible(false);
        setIsShowMoreButtonVisible(true);
        setCommentToDisplay(commentBeforeEditing);
        setIsCommentExpanded(false);
        setCommentToDisplay(truncatedComment);
    }

    function handleDeleteCommentYes() {
        setIsShowMoreButtonVisible(true);
        setCommentToDisplay(truncatedComment);
        setIsCommentExpanded(false);

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

    function handleShowMoreButton(isCommentFullyDisplayed) {
        setComment("");
        setIsEditingPoll(false);
        setIsEditingComment(false);
        setIsConfirmDeletePollVisible(false);

        if (isCommentFullyDisplayed) {
            setIsCommentExpanded(false);
            setCommentToDisplay(truncatedComment);
        } else {
            setIsCommentExpanded(true);
            setCommentToDisplay(fullComment);
        }
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
                    ? <div>
                        <Link to={`/poll/${commentObject.pollId}`} className="comment-card-poll-title">{commentObject.pollTitle}</Link>
                    </div>
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
                    : <p className="copy-output">{commentToDisplay}</p>
                }

                {isCommentTooLong && isShowMoreButtonVisible
                    ? <div>
                        <span className="show-more-button" onClick={() => handleShowMoreButton(isCommentExpanded)}>{isCommentExpanded ? "Hide" : "Show More"}</span>
                    </div>
                    : null
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
                    ? <div>
                        <button
                            onClick={handleEditCommentButton}
                        >Edit</button>
                    </div>
                    : null
                }
                
                {isEditingComment
                    ? <div className="buttons">
                        <button onClick={handleCancelEditComment}>Cancel</button>
                        <button onClick={handleUpdateComment} disabled={!originalComment}>Update</button>
                        <button onClick={handleDeleteComment}>Delete</button>
                    </div>
                    : null
                }

                {isConfirmDeleteCommentVisible
                    ? <div id="delete-comment">
                        <div className="confirm">Delete comment?</div>
                        <div className="buttons">
                            <button onClick={handleDeleteCommentNo}>No</button>
                            <button onClick={handleDeleteCommentYes}>Yes</button>
                        </div>
                    </div>                
                    : null
                }
            </div>
        </div>
    )
}