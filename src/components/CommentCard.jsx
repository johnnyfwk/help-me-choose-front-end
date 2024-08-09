import { Link } from 'react-router-dom';
import * as utils from '../../utils';

export default function CommentCard({comment, page}) {
    console.log("Comment:", comment)
    return (
        <div className="comment-card">
            {page === "profile"
                ? <Link to={`/question/${comment.questionId}`}>{comment.questionTitle}</Link>
                : null
            }
            <div>{comment.comment}</div>
            {page === "question"
                ? <div>{comment.commentOwnerUsername}</div>
                : null
            }
            <div>{utils.formatDate(comment.commentCreated)}</div>
        </div>
    )
}