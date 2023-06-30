import { get } from "./main.js";
import { fetchTotalPost } from "./fetchGetPost(api).js";

export let comments = [];

function renderApp(comments, getCommentsList, element) {
    const commentsHTML = comments.map((comment, index) => getCommentsList(comment, index)).join('');
    const appHtml = ` <div class="loader">Пожалуйста подождите, страница загружается...</div>
    <div class="container">
    <ul class="comments" id="listComments">
    ${commentsHTML} </ul>

    <p class="authorization-text">Чтобы оставить комментарий, <a class="authorization-link" href="#">авторизуйтесь</a></p>
    <div class="add-form-authorization">
      <div class="authorization-form">
        <input type="login" class="add-form-login" placeholder="Введите Ваш логин">
        <input type="password" class="add-form-password" placeholder="Введите Ваш пароль">
        <button class="enter-button">Войти</button>
        <button class="reg-button">Зарегистрироваться</button>
      </div>
    </div>

    <div class="add-form-authorization">
      <div class="authorization-form">
        <input type="login" class="add-form-login" placeholder="Введите логин">
        <input type="password" class="add-form-password" placeholder="Введите пароль">
        <button class="reg-button">Зарегистрироваться</button>
      </div>
    </div>

    <div class="add-form">
      <input type="text" class="add-form-name" placeholder="Введите ваше имя" />
      <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
      <div class="add-form-row">
        <button class="delete-button">Удалить комментарий</button>
        <button class="add-form-button">Написать</button>
      </div>
    </div>
  </div>
    `
    element.innerHTML = appHtml;

    const listComments = document.getElementById('listComments');
    const addForm = document.querySelector('.add-form');
    const loaderBody = document.querySelector('.loader');
    const inputNameElement = document.querySelector('.add-form-name');
    const inputTextElement = document.querySelector('.add-form-text');
    const buttonElement = document.querySelector('.add-form-button');
    const commentsElement = document.querySelector('.comments');
    const buttonElementDel = document.querySelector('.delete-button');
    const currentDate = new Date().toLocaleDateString('default', { day: '2-digit', month: '2-digit', year: '2-digit' }) + " " + new Date().toLocaleTimeString().slice(0, -3);
    const appEL = document.getElementById("app");

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
    initButtonLike();
    replyComment();
}
export default renderApp();