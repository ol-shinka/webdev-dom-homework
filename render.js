import { initButtonLike, replyComment } from "./main.js";

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
    initButtonLike();
    replyComment();
}
export default renderApp();