"use strict";

import { dateGet } from "./Date.js";
//import renderApp from "./render.js";
import { getCommentsList } from "./getCommentsList.js";
import { fetchTotalPost } from "./fetchGetPost(api).js";
import { fetchTotalGet } from "./fetchGetPost(api).js";
export { comments, initButtonLike, replyComment, dateGet };

const listComments = document.getElementById('listComments');
const addForm = document.querySelector('.add-form');
let token = "Bearer asb4c4boc86gasb4c4boc86g37k3bk3cg3c03ck3k37w3cc3bo3b8"
//inputNameElement, inputTextElement

const commentsElement = document.querySelector('.comments');

const currentDate = new Date().toLocaleDateString('default', { day: '2-digit', month: '2-digit', year: '2-digit' }) + " " + new Date().toLocaleTimeString().slice(0, -3);


let comments = [];

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
      return renderApp(listComments, getCommentsList, comments)
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

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (!token) {
    const appHtml = `<div class="add-form-authorization">
    <div class="authorization-form">
      <input type="login" class="add-form-login" placeholder="Введите Ваш логин">
      <input type="password" class="add-form-password" placeholder="Введите Ваш пароль">
      <button class="enter-button">Войти</button>
      <button class="reg-button">Зарегистрироваться</button>
    </div>
  </div>`
    appEl.innerHTML = appHtml;
    document.querySelectorAll(".enter-button").addEventListener("click", () => {
  let token = "Bearer asb4c4boc86gasb4c4boc86g37k3bk3cg3c03ck3k37w3cc3bo3b8";
  fetchTotalGet();
})
return;
  }
const commentsHtml = comments.map((comment, index) => {
  return `<li class="comment" data-index="${index}">
      <div class="comment-header">
        <div>${comment.name
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")}</div>
        <div>${comment.dateLast}</div>
      </div>
      <div class="comment-body">
         <div class="comment-text">
          ${comment.text.
      replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
      .replaceAll("QUOTE_END", "</div>")}</div>
      </div>
      <div class="comment-footer">
       <div class="likes">
         <span class="likes-counter"> ${comment.likesQuantity}</span>
        <button data-index="${index}" class="${comment.likeColor}"></button>
       </div>
     </div>
  
    </li>`;
}).join("");
const appHtml = `<div class="container">
  <div class="loader">Пожалуйста подождите, страница загружается...</div>
  <ul class="comments" id="listComments">

    <!-- Список рендерится из JS -->

  ${commentsHtml}

  </ul>
  <p class="authorization-text">Чтобы оставить комментарий, <a class="authorization-link" href="#">авторизуйтесь</a></p>
  <div class="add-form">
    <input type="text" class="add-form-name" placeholder="Введите ваше имя" />
    <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
    <div class="add-form-row">
      <button class="delete-button">Удалить комментарий</button>
      <button class="add-form-button">Написать</button>
    </div>
  </div>
</div>`


const loaderBody = document.querySelector('.loader');
loaderBody.style.display = "none";
initButtonLike();
replyComment();
const buttonElement = document.querySelector('.add-form-button');
buttonElement.setAttribute('disabled', true);
const inputNameElement = document.querySelector('.add-form-name');
const inputTextElement = document.querySelector('.add-form-text');
const buttonElementDel = document.querySelector('.delete-button');

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
};

renderApp(getCommentsList, listComments, comments);


function post(moduleFetch) {
  return moduleFetch()
    .then(() => {
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



