import { Link } from 'react-router-dom';
import * as utils from '../../utils';

export default function PollCard({
    poll,
    page,
    handlePollCardCategory,
    handlePollCardTitle
}) {
    function handlePollCardLink() {
        window.scrollTo(0, 0);
    }

    return (
        <div className="poll-card-wrapper">
            <div className="poll-card-profile-image-section">
                <Link to={`/profile/${poll.pollOwnerId}`} onClick={handlePollCardLink}>
                    <div className="poll-card-profile-image-wrapper">
                        <img src={poll.pollOwnerImageUrl} alt={`Profile image of ${poll.pollOwnerUsername}`} className="poll-card-user-image"/>  
                    </div>
                </Link>
            </div>

            <div className="poll-card-details">
                {page === "home" || page === "poll"
                    ? <div className="poll-card-username">
                        <Link to={`/profile/${poll.pollOwnerId}`} onClick={handlePollCardLink}>{poll.pollOwnerUsername}</Link>
                    </div>
                    : null
                }

                <div className="poll-card-title">
                    <Link to={`/poll/${poll.id}`} onClick={handlePollCardTitle}>{poll.pollTitle}</Link>
                </div>
                
                <p>{poll.pollDescription}</p>

                <div className="poll-card-category">
                    <Link
                        to={`/?category=${utils.convertToSlug(poll.pollCategory)}`}
                        onClick={() => handlePollCardCategory(poll.pollCategory)}
                    >{poll.pollCategory}</Link>
                </div>
                            
                <div className="poll-card-created-date">{utils.formatDate(poll.pollCreated)}</div>
            </div>
        </div>
    )
}