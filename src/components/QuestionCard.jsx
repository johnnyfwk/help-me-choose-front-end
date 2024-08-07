import * as utils from '../../utils';

export default function QuestionCard({
    question
}) {
    return (
        <div className="question-wrapper">
            <h2>{question.title}</h2>
            <p>{question.description}</p>
            <div>{question.category}</div>
            <div>{question.username}</div>                                
            <div>{utils.formatDate(question.created)}</div>
        </div>
    )
}