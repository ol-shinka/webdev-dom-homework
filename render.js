import {initButtonLike, replyComment} from "./main.js";

function renderComments(element, getCommentsList) {
    const commentsHTML = comments.map((comment, index) => getCommentsList(comment, index)).join('');
    element.innerHTML = commentsHTML;
    initButtonLike();
    replyComment();
}
export default renderComments;