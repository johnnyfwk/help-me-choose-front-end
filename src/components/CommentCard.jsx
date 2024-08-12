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
    isEditingQuestion,
    setIsEditingQuestion,
    editingCommentId,
    setEditingCommentId,
    setComments
}) {
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [originalComment, setOriginalComment] = useState("");
    const [isConfirmDeleteCommentVisible, setIsConfirmDeleteCommentVisible] = useState(false);

    useEffect(() => {
        if (comment || isEditingQuestion) {
            setIsEditingComment(false);
        }
        if (editingCommentId !== commentObject.id) {
            setIsEditingComment(false);
        }
    }, [comment, isEditingQuestion, editingCommentId])

    function handleEditCommentButton() {
        setEditingCommentId(commentObject.id)
        setIsEditingComment(true);
        setOriginalComment(commentObject.comment);
        setIsEditingQuestion(false);
        setComment("");
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
            const updatedComment = {...commentObject, comment: originalComment};
            updateComment(updatedComment);
            setIsEditingComment(false);
        })
        .catch((error) => {
            console.log(error.message);
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
                setComments((currentComments) => {
                    const updatedComments = currentComments.filter((comment) => {
                        return comment.id !== editingCommentId;
                    })
                    return updatedComments;
                })
                console.log("Comment has been deleted!");
            })
            .catch((error) => {
                console.log(error);
                console.log("Comment could not be deleted.");
            })
    }

    return (
        <div className="comment-card">
            {page === "profile"
                ? <Link to={`/question/${commentObject.questionId}`}>{commentObject.questionTitle}</Link>
                : null
            }

            {page === "question"
                ? <div>{commentObject.commentOwnerUsername}</div>
                : null
            }

            {isEditingComment
                ? <InputComment
                    comment={originalComment}
                    handleComment={handleEditComment}
                />
                : <div>{commentObject.comment}</div>
            }

            <div>{utils.formatDate(commentObject.commentCreated)}</div>
            
            {user &&
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
                    <div>Delete comment?</div>
                    <button onClick={handleDeleteCommentNo}>No</button>
                    <button onClick={handleDeleteCommentYes}>Yes</button>
                </div>                
                : null
            }
        </div>
    )
}