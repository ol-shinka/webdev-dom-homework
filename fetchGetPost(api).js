import { dateGet } from "./Date.js";
import {inputNameElement, inputTextElement} from "./main.js";

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


function fetchTotalPost() {
  return fetch("https://wedev-api.sky.pro/api/v1/:ol-shinka/comments", {
    method: "POST",
    body: JSON.stringify({
      name: inputNameElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;"),
      text: inputTextElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
      .replaceAll("QUOTE_END", "</div><br><br>,"),
      forceError: true
    })
  }).then((response) => {
    if (response.status === 500) {
      throw new Error("Сервер не отвечает");
    }
    if (response.status === 400) {
      throw new Error("Некорректный запрос");
    }
    return fetchTotalGet();
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
}


export { fetchTotalGet, fetchTotalPost };
