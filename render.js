import { initButtonLike, replyComment } from "./main.js";

export let comments = [];

function renderApp(commentsElement, getCommentsList) {
    const commentsHTML = comments.map((comment, index) => getCommentsList(comment, index)).join('');
    commentsElement.innerHTML = commentsHTML;
    initButtonLike();
    replyComment();
}
export default renderApp();