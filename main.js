"use strict";

import {dateGet} from "./Date.js";
import renderComments from "./render.js";
import {getCommentsList} from "./getCommentsList.js";
export {comments};

const listComments = document.getElementById('listComments');
const loaderBody = document.querySelector('.loader');
const inputNameElement = document.querySelector('.add-form-name');
const inputTextElement = document.querySelector('.add-form-text');
const buttonElement = document.querySelector('.add-form-button');
const commentsElement = document.querySelector('.comments');
const buttonElementDel = document.querySelector('.delete-button');
const currentDate = new Date().toLocaleDateString('default', { day: '2-digit', month: '2-digit', year: '2-digit' }) + " " + new Date().toLocaleTimeString().slice(0, -3);


let comments = [];

function fetchTotalGet() {
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

fetchTotalGet();

function initButtonLike() {

  const buttonLikes = document.querySelectorAll('.like-button');

  for (const like of buttonLikes) {
    like.addEventListener("click", (event) => {
      const likeIndex = like.dataset.index;
      const commentsElement = comments[likeIndex];
      event.stopPropagation();

      if (commentsElement.commentLike) {
        commentsElement.likesQuantity -= 1;
        commentsElement.commentLike = false;
        commentsElement.likeColor = "like-button -no-active-like";

      } else {
        commentsElement.likesQuantity += 1;
        commentsElement.commentLike = true;
        commentsElement.likeColor = "like-button -active-like";
      }
      renderComments();
    })
  }
};

initButtonLike();

const replyComment = () => {
  const commentElement = document.querySelectorAll(".comment");

  for (const comment of commentElement) {
    comment.addEventListener("click", () => {
      const index = comment.dataset.index;
      inputTextElement.value = `QUOTE_BEGIN ${comments[index].text}\n${comments[index].name} QUOTE_END`;
    });
  };
};
fetchTotal();
replyComment();

//const renderComments = () => {
//  const commentsHtml = comments.map((comment, index) => {
//    return `<li class="comment" data-index="${index}">
 //       <div class="comment-header">
  //        <div>${comment.name
  //      .replaceAll("&", "&amp;")
//        .replaceAll("<", "&lt;")
  //      .replaceAll(">", "&gt;")
  //      .replaceAll('"', "&quot;")}</div>
  //        <div>${comment.dateLast}</div>
  //      </div>
  //      <div class="comment-body">
 //         <div class="comment-text">
  //          ${comment.text.
  //      replaceAll("&", "&amp;")
  //      .replaceAll("<", "&lt;")
  //      .replaceAll(">", "&gt;")
   //     .replaceAll('"', "&quot;")
   //     .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
  //      .replaceAll("QUOTE_END", "</div>")}</div>
  //      </div>
  //      <div class="comment-footer">
   //       <div class="likes">
   //         <span class="likes-counter"> ${comment.likesQuantity}</span>
   //         <button data-index="${index}" class="${comment.likeColor}"></button>
  //        </div>
  //      </div>
  //  
  //    </li>`;
//  }).join("");

 // commentsElement.innerHTML = commentsHtml;
 // initButtonLike();
 // replyComment();

//};

renderComments(getCommentsList, listComments);

buttonElement.setAttribute('disabled', true);

inputNameElement.addEventListener("input", () => {
  buttonElement.setAttribute('disabled', true);

  if ((inputNameElement.value.length > 0) && (inputTextElement.value.length > 0)) {
    buttonElement.removeAttribute('disabled');
  }
});

inputTextElement.addEventListener("input", () => {

  buttonElement.setAttribute('disabled', true);
  if ((inputNameElement.value.length > 0) && (inputTextElement.value.length > 0)) {
    buttonElement.removeAttribute('disabled');
  }
});

buttonElement.addEventListener("click", () => {
  buttonElement.setAttribute('disabled', true);

  buttonElement.disabled = true;
  buttonElement.textContent = "Коммент добавляется...";
  

  fetch("https://wedev-api.sky.pro/api/v1/:ol-shinka/comments", {
    method: "POST",
    body: JSON.stringify({
      name: inputNameElement.value,
      text: inputTextElement.value,
      forceError: true
    })
  }).then((response) => {
    if (response.status === 500) {
      throw new Error("Сервер не отвечает");
    }
    if (response.status === 400) {
      throw new Error("Некорректный запрос");
    }
    return fetchTotal();
    inputNameElement.value = "";
    inputTextElement.value = "";
    buttonElement.disabled = false;
    buttonElement.textContent = "Написать";
  }).then((response) => {
    buttonElement.disabled = false;
    buttonElement.textContent = "Написать";
  })
    .catch((error) => {
      if (error.message === "Сервер не отвечает") {
        alert("Ой, что-то пошло не так, попробуй позже");
        return;
      }
      if (error.message === "Некорректный запрос") {
        alert("Имя должно содержать не менее 3 символов, исправь данные и попробуй снова");
        return;
      }
      console.log(error);
    });
  renderComments();
});



document.addEventListener("keyup", function (enter) {
  if (enter.keyCode == 13) {
    buttonElement.click();
  }
});

buttonElementDel.addEventListener("click", () => {
  comments.pop();
  renderComments();
});
