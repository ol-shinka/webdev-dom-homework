import { fetchPost, fetchDelete, memoryLike } from "./api.js";
import { getAPI } from "./script.js";
import { renderLoginComponent } from "./components/login-component.js"
import { getListComments } from "./listComments.js";

let token = null;
let name = null;

const renderApp = (comments, listComments) => {


  const appEl = document.getElementById('app');

  if (!token) {
    renderLoginComponent({
      comments,
      appEl,
      setToken: (newToken) => {
        token = newToken;
      },
      setName: (newName) => {
        name = newName;
      },
      getAPI
    });
  } else {

    const commentsHtml = comments.map((comment, index) => listComments(comment, index)).join("");

    const appHTML = `<div class="container">

  <ul class="comments">
   ${commentsHtml}
  </ul>

  
  <div class="add-form">
    <input type="text" class="add-form-name" value = "${name}" />
    <textarea type="textarea" class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
    <div class="add-form-row">
      <button class="add-form-button">Написать</button>
      <button class="delete-button">Удалить комментарий</button>
    </div>
  </div>
  <div class="comment-loading">Коммент добавляется...</div>
</div>`;


    appEl.innerHTML = appHTML;

    const formCommentElement = document.querySelector('.add-form');
    const inputNameElement = document.querySelector('.add-form-name');
    const inputTextElement = document.querySelector('.add-form-text');
    const buttonElement = document.querySelector('.add-form-button');
    const commentsElement = document.querySelector('.comments');
    const buttonElementDel = document.querySelector('.delete-button');
    const commentLoadingElement = document.querySelector('.comment-loading');
    const currentDate = new Date().toLocaleDateString('default', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
      " " + new Date().toLocaleTimeString().slice(0, -3);


    //редактировать текст коммента

    function changeComment() {
      const editorButtonElements = document.querySelectorAll('.editor-button');
      const commentsBodyElements = document.querySelectorAll('.comment-body');

      inputNameElement.setAttribute('disabled', true);

      for (const editorButtonElement of editorButtonElements) {
        editorButtonElement.addEventListener("click", (event) => {
          event.stopPropagation();

          const editorButtonIndex = editorButtonElement.dataset.index;

          if (editorButtonElement.textContent === 'Редактировать') {
            editorButtonElement.textContent = 'Сохранить';
            commentsBodyElements[editorButtonIndex].innerHTML = `<textarea class="comment-text">${comments[editorButtonIndex].text}</textarea>`;
          } else {
            comments[editorButtonIndex].text = editorButtonElement.closest('.comment').querySelector('textarea').value;
            comments[editorButtonIndex].dateСreation = `${currentDate} (изменено)`;
            renderApp(comments, getListComments)
          }
        }
        )
      }
    }
    changeComment();

    // функция для имитации запросов в API

    function delay(interval = 100) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, interval);
      });
    };


    function initButtonLike() {

      const likesButton = document.querySelectorAll('.like-button');
      for (const like of likesButton) {
        like.addEventListener("click", (event) => {
          const likeIndex = like.dataset.index;
          const commentsElementLikeIndex = comments[likeIndex];
          event.stopPropagation();

          if (commentsElementLikeIndex.likeComment) {
            commentsElementLikeIndex.likesNumber -= 1;
            commentsElementLikeIndex.likeComment = false;
            commentsElementLikeIndex.propertyColorLike = 'like-button -no-active-like';
          } else {
            commentsElementLikeIndex.likesNumber += 1;
            commentsElementLikeIndex.likeComment = true;
            commentsElementLikeIndex.propertyColorLike = 'like-button -active-like';
          }


          const id = like.dataset.id;

          memoryLike({ id, token });

          delay(200).then(() => {
            getAPI();
          })

        })
      }
    };

    initButtonLike();

    function replyComment() {
      let commentElements = document.querySelectorAll('.comment');

      for (const commentElement of commentElements) {
        commentElement.addEventListener("click", () => {

          const indexComment = commentElement.dataset.index;
          let QUOTE_BEGIN = 'QUOTE_BEGIN';
          let QUOTE_END = 'QUOTE_END';
          inputTextElement.value =
            `${QUOTE_BEGIN}${comments[indexComment].name}:\n${comments[indexComment].text}${QUOTE_END}\n\n`;
        }
        )
      }
    };

    replyComment();


    buttonElement.setAttribute('disabled', true);


    inputTextElement.addEventListener("input", () => {

      buttonElement.setAttribute('disabled', true);

      if (inputTextElement.value.length > 0) {

        buttonElement.removeAttribute('disabled');
      }
    });


    const postData = () => {

      return fetchPost(token, inputTextElement, inputNameElement)
        .then((response) => {
          return getAPI();
        })
        .then((data) => {
          commentLoadingElement.classList.add('comment-loading');
          formCommentElement.classList.remove('comment-loading');

          inputNameElement.value = "";
          inputTextElement.value = "";

        })
        .catch((error) => {

          // В объекте error есть ключ message, в котором лежит сообщение об ошибке
          // Если сервер сломался, то просим попробовать позже
          if (error.message === "Сервер не отвечает") {
            alert("Сервер не отвечает, попробуйте позже");
            postData();
          } else
            // Если пользователь накосячил с запросом, просим поправить
            if (error.message === "Некорретный запрос") {
              alert("Имя и комментарий должны содержать не менее трех символов");
            } else {
              alert('Кажется, что-то с интернетом, попробуйте позже');
              console.log(error);
            }

          buttonElement.removeAttribute('disabled');
          commentLoadingElement.classList.add('comment-loading');
          formCommentElement.classList.remove('comment-loading');

          console.log(error);
        });
    };


    buttonElement.addEventListener("click", () => {

      commentLoadingElement.classList.remove('comment-loading');
      formCommentElement.classList.add('comment-loading');
      buttonElement.setAttribute('disabled', true);

      //отпраляем новые данные 
      postData(fetchPost);
    });


    document.addEventListener("keyup", function (event) {
      if (event.shiftKey && (event.keyCode === 13)) {
        //переносит на другую строку
      } else if (event.keyCode === 13) {
        buttonElement.click();
      }
    });

    buttonElementDel.addEventListener("click", () => {

      comments.pop();
      renderApp(comments, getListComments)
    });
  }
};

export default renderApp;