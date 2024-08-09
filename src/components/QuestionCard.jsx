import { Link } from 'react-router-dom';
import * as utils from '../../utils';

export default function QuestionCard({
    question,
    page
}) {
    return (
        <div className="question-wrapper">
            <Link to={`/question/${question.id}`}>{question.questionTitle}</Link>
            <p>{question.questionDescription}</p>
            <div>{question.questionCategory}</div>
            {page === "home"
                ? <div>{question.questionOwnerUsername}</div>   
                : null
            }                 
            <div>{utils.formatDate(question.questionCreated)}</div>
        </div>
    )
}