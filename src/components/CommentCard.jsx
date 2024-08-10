import { useState } from 'react';
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
    comment,
    page,
    user,
    updateComment
}) {
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [originalComment, setOriginalComment] = useState("");

    function handleEditCommentButton() {
        setIsEditingComment(true);
        setOriginalComment(comment.comment);
    }

    function handleCancelEditComment() {
        setIsEditingComment(false);
    }

    function handleUpdateComment() {
        const docRef = doc(db, 'comments', comment.id);
        console.log("comment ID:", comment.id)
        console.log("handleComment:", originalComment)
        updateDoc(docRef, {
            comment: originalComment,
            commentModified: serverTimestamp()
        })
        .then((response) => {
            console.log(response);
            console.log("Comment has been updated.");
            const updatedComment = {...comment, comment: originalComment};
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
        console.log(updatedComment);
        setOriginalComment(updatedComment);
    }

    return (
        <div className="comment-card">
            {page === "profile"
                ? <Link to={`/question/${comment.questionId}`}>{comment.questionTitle}</Link>
                : null
            }

            {page === "question"
                ? <div>{comment.commentOwnerUsername}</div>
                : null
            }

            {isEditingComment
                ? <InputComment comment={originalComment} handleComment={handleEditComment} />
                : <div>{comment.comment}</div>
            }

            <div>{utils.formatDate(comment.commentCreated)}</div>
            
            {user && comment.commentOwnerId === user.uid && !isEditingComment
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