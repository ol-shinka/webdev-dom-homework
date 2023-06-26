import { inputNameElement, inputTextElement } from "./main.js";
import { dateGet } from "./Date.js";

function fetchTotalGet() {
  return fetch("https://wedev-api.sky.pro/api/v1/:ol-shinka/comments", {
    method: "GET"
  })
    .then((response) => {
      return response.json()
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
        .replaceAll("QUOTE_END", "</div><br></br>,")
    }),
    lastDate: dateGet(new Date),
    likesQuantity: 0,
    likeColor: "like-button -no-active-like",
    commentLike: false,
    forceError: true
  }).then((response) => {
    if (response.status === 500) {
      throw new Error("Сервер не отвечает");
    } else if (response.status === 400) {
      throw new Error("Некорректный запрос");
    }
    else {
      return response.json();
    }
  })
}

export { fetchTotalGet, fetchTotalPost };
