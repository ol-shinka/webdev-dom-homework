"use strict";

import { dateGet } from "./Date.js";
import renderApp from "./render.js";
import { getCommentsList } from "./getCommentsList.js";
import { fetchTotalGet } from "./fetchGetPost(api).js";

function get(moduleFetch) {
  return moduleFetch()
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          text: comment.text,
          dateLast: dateGet(new Date(comment.date)),
          likesQuantity: comment.likes,
          likeColor: "like-button -no-active-like",
          commentLike: false
        }
      });
      comments = appComments;
      return renderApp(appEl, getCommentsList, comments)
    })
  //.then(() => {
  // document.body.classList.add('loader');
  // });
};

get(fetchTotalGet);




