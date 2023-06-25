
function renderComments(element, getCommentsList) {
    const commentsHTML = comments.map((comment, index) => getCommentsList(comment, index)).join('');
    element.innerHTML = commentsHTML;
    initButtonLike();
    replyComments();
}
export default renderComments;