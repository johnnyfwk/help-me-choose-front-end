import { Link } from 'react-router-dom';
import * as utils from '../../utils';

export default function QuestionCard({
    question,
    page
}) {
    return (
        <div className="question-wrapper">
            <Link to={`/question/${question.id}`}>{question.title}</Link>
            <p>{question.description}</p>
            <div>{question.category}</div>
            {page === "home"
                ? <div>{question.ownerUsername}</div>   
                : null
            }                 
            <div>{utils.formatDate(question.created)}</div>
        </div>
    )
}