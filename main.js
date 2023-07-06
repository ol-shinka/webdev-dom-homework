"use strict";

import { getCurrentDate } from "./date.js";
import renderApp from "./render.js";
import { fetchGet } from "./api.js";
import { getListComments } from "./listComments.js";
const commentsLoading = document.querySelector('.data-loading');


let comments = [];

export function getAPI() {
  return fetchGet()
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          id: comment.id,
          name: comment.author.name,
          dateСreation: getCurrentDate(new Date(comment.date)),
          text: comment.text,
          likeComment: comment.isLiked,
          likesNumber: comment.likes,
          propertyColorLike: 'like-button no-active-like',
        }
      });
      comments = appComments;
      return renderApp(comments, getListComments);
    })
    .then((response) => {
      commentsLoading.style.display = 'none';
    })
    .catch((error) => {

      if (error.message === "Сервер сломался") {
        alert("Сервер сломался, попробуйте позже");
        getAPI();
      } else if (error.message === "Нет авторизации") {          
          console.log(error);
        } else {
          alert('Кажется, что-то с интернетом, попробуйте позже');
          console.log(error);
        }
    });
};

getAPI();