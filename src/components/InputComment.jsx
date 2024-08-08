export default function InputComment({
    comment,
    setComment
}) {
    function handleComment(event) {
        setComment(event.target.value);
    }

    return (
        <div id="input-comment">
            <textarea
                id="comment"
                name="comment"
                value={comment}
                onChange={handleComment}
                maxLength="2000"
                placeholder="Enter your comment and help the poster make a choice."
            ></textarea>
        </div>
    )
}