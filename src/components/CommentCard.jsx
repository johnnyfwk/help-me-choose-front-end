import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as utils from '../../utils';
import InputComment from './InputComment';
import { db } from '../firebase';
import {
    doc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';

export default function CommentCard({
    commentObject,
    page,
    user,
    updateComment,
    comment,
    setComment,
    isEditingQuestion,
    setIsEditingQuestion
}) {
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [originalComment, setOriginalComment] = useState("");

    useEffect(() => {
        setIsEditingComment(false);
    }, [comment, isEditingQuestion])

    function handleEditCommentButton() {
        setIsEditingComment(true);
        setOriginalComment(commentObject.comment);
        setComment("");
        setIsEditingQuestion(false);
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
    }

    function handleEditComment(event) {
        let updatedComment = event.target.value;
        setOriginalComment(updatedComment);
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
                ? <InputComment comment={originalComment} handleComment={handleEditComment} />
                : <div>{commentObject.comment}</div>
            }

            <div>{utils.formatDate(commentObject.commentCreated)}</div>
            
            {user && commentObject.commentOwnerId === user.uid && !isEditingComment
                ? <button onClick={handleEditCommentButton}>Edit</button>
                : null
            }
            {isEditingComment
                ? <button onClick={handleCancelEditComment}>Cancel</button>
                : null
            }
            {isEditingComment
                ? <button
                    onClick={handleUpdateComment}
                    disabled={!originalComment}
                >Update</button>
                : null
            }
            {isEditingComment
                ? <button onClick={handleDeleteComment}>Delete</button>
                : null
            }
        </div>
    )
}