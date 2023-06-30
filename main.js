"use strict";

import { dateGet } from "./Date.js";
import renderApp from "./render.js";
import { getCommentsList } from "./getCommentsList.js";
import { fetchTotalPost } from "./fetchGetPost(api).js";
import { fetchTotalGet } from "./fetchGetPost(api).js";

const listComments = document.getElementById('listComments');
const addForm = document.querySelector('.add-form');
const loaderBody = document.querySelector('.loader');
const inputNameElement = document.querySelector('.add-form-name');
const inputTextElement = document.querySelector('.add-form-text');
const buttonElement = document.querySelector('.add-form-button');
const commentsElement = document.querySelector('.comments');
const buttonElementDel = document.querySelector('.delete-button');
const currentDate = new Date().toLocaleDateString('default', { day: '2-digit', month: '2-digit', year: '2-digit' }) + " " + new Date().toLocaleTimeString().slice(0, -3);
export { inputNameElement, inputTextElement, initButtonLike, replyComment, dateGet, renderApp };
const appEL = document.getElementById("app");


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
      renderApp();
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
fetchTotalGet();
replyComment();

renderApp(getCommentsList, listComments, comments);
loaderBody.style.display = "none";

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


  function post(moduleFetch) {
    return moduleFetch()
      .then((response) => {
        return get(fetchTotalGet);
      })
      .then(() => {
        loaderBody.style.display = "none";
        inputNameElement.value = "";
        inputTextElement.value = "";
        buttonElement.disabled = false;
        buttonElement.textContent = "Написать";
      })
      .catch((error) => {
        if (error.message === "Сервер упал") {
          alert("Сервер упал, пожалуйста, попробуйте позже");
          postData(fetchTotalPost);
        } else if (error.message === "Некорректный запрос") {
          alert("Имя и комментарий должны содержать не менее 3 символов");
        } else {
          alert("Кажется, что-то с интернетом, попробуйте позже");
          console.log(error);
        }
        loaderBody.style.display = "none";
      });
  };

  document.addEventListener("keyup", function (enter) {
    if (enter.keyCode == 13) {
      buttonElement.click();
    }
  });
  post(fetchTotalPost);
});

buttonElementDel.addEventListener("click", () => {
  comments.pop();
  renderApp();
});



