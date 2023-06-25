import {dateGet} from "./Date.js";

function fetchTotal(comments) {
    return fetch("https://wedev-api.sky.pro/api/v1/:ol-shinka/comments", {
      method: "GET"
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        const appComments = responseData.comments.map((comment) => {
          return {
            name: comment.author.name,
            dateLast: dateGet(new Date(comment.date)),
            text: comment.text,
            likesQuantity: comment.likes,
            likeColor: "like-button -no-active-like",
            commentLike: false
          }
        });
        comments = appComments;
        return renderComments();
      }).then((response) => {
        loaderBody.style.display = "none";
      })
  };
  
export {fetchTotal};