import { Link } from 'react-router-dom';
import * as utils from '../../utils';

export default function QuestionCard({
    question,
    page,
    handleQuestionCardCategory,
    handleQuestionCardTitle
}) {
    return (
        <div className="question-card-wrapper">
            {page === "home" || page === "question"
                ? <Link to={`/profile/${question.questionOwnerId}`}>
                    <div className="question-card-user-image-wrapper">
                        <img src={question.questionOwnerImageUrl} alt={`Profile image of ${question.questionOwnerUsername}`} className="question-card-user-image"/>  
                    </div>
                </Link>
                : null
            }

            {page === "home" || page === "question"
                ? <div>
                    <Link to={`/profile/${question.questionOwnerId}`}>{question.questionOwnerUsername}</Link>
                </div> 
                : null
            }
            <Link to={`/poll/${question.id}`} onClick={handleQuestionCardTitle}>{question.questionTitle}</Link>
            <p>{question.questionDescription}</p>
            <Link
                to={`/?category=${utils.convertToSlug(question.questionCategory)}`}
                onClick={() => handleQuestionCardCategory(question.questionCategory)}
            >{question.questionCategory}</Link>
                          
            <div>{utils.formatDate(question.questionCreated)}</div>
        </div>
    )
}