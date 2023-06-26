const getCommentsList = (comment, index) => {
    return `<li class="comment" data-index="${index}">
    <div class="comment-header">
      <div>${comment.name}</div>
      <div>${comment.dateLast}</div>
    </div>
    <div class="comment-body">
    <div class="comment-text">${comment.text}</div>
    </div>
    <div>
    <textarea type="textarea">${comment.text}</textarea>
    </div>
    <div class="comment-footer">    
      <div class="likes">
        <span class="likes-counter">${comment.likesQuantity}</span>
        <button class="${comment.likeColor}" data-index="${index}"></button>
      </div>
    </div>
  </li>`;
}
export {getCommentsList};
