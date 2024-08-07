import { Link } from 'react-router-dom';
import * as utils from '../../utils';

export default function QuestionCard({
    question
}) {
    return (
        <div className="question-wrapper">
            <Link to={`/question/${question.id}`}>{question.title}</Link>
            <p>{question.description}</p>
            <div>{question.category}</div>
            <div>{question.posterUsername}</div>                                
            <div>{utils.formatDate(question.created)}</div>
        </div>
    )
}