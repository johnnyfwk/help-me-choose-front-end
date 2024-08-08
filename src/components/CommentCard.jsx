import * as utils from '../../utils';

export default function CommentCard({comment}) {
    return (
        <div className="comment-card">
            <div>{comment.comment}</div>
            <div>{comment.commentOwnerUsername}</div>
            <div>{utils.formatDate(comment.commentCreated)}</div>
        </div>
    )
}