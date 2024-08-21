import { useEffect } from "react";

export default function InputComment({
    comment,
    handleComment
}) {
    useEffect(() => {
        const textarea = document.getElementById('comment');

        if (textarea) {
            function autoResize() {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            }
    
            textarea.addEventListener('input', autoResize);
    
            return () => {
                textarea.removeEventListener('input', autoResize);
            };
        }
    }, [])

    return (
        <div id="input-comment">
            <textarea
                id="comment"
                name="comment"
                value={comment}
                onChange={handleComment}
                maxLength="2000"
                placeholder="Enter a comment and help the poster make a choice."
            ></textarea>
        </div>
    )
}