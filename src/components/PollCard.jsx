import { Link } from 'react-router-dom';
import * as utils from '../../utils';

export default function PollCard({
    poll,
    page,
    handlePollCardCategory,
    handlePollCardTitle
}) {
    return (
        <div className="poll-card-wrapper">
            {page === "home" || page === "poll"
                ? <Link to={`/profile/${poll.pollOwnerId}`}>
                    <div className="poll-card-user-image-wrapper">
                        <img src={poll.pollOwnerImageUrl} alt={`Profile image of ${poll.pollOwnerUsername}`} className="poll-card-user-image"/>  
                    </div>
                </Link>
                : null
            }

            {page === "home" || page === "poll"
                ? <div>
                    <Link to={`/profile/${poll.pollOwnerId}`}>{poll.pollOwnerUsername}</Link>
                </div> 
                : null
            }
            <Link to={`/poll/${poll.id}`} onClick={handlePollCardTitle}>{poll.pollTitle}</Link>
            <p>{poll.pollDescription}</p>
            <Link
                to={`/?category=${utils.convertToSlug(poll.pollCategory)}`}
                onClick={() => handlePollCardCategory(poll.pollCategory)}
            >{poll.pollCategory}</Link>
                          
            <div>{utils.formatDate(poll.pollCreated)}</div>
        </div>
    )
}