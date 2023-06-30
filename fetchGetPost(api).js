import { dateGet } from "./Date.js";

let host = "https://wedev-api.sky.pro/api/v2/:ol-shinka/comments";
let token = "Bearer asb4c4boc86gasb4c4boc86g37k3bk3cg3c03ck3k37w3cc3bo3b8";


function fetchTotalGet(token) {
  return fetch(host, {
    method: "GET",
    headers: {
      Authorization: token,
    }
  })
    .then((response) => {
      return response.json()
    })
};


function fetchTotalPost(token, inputNameElement, inputTextElement) {
  return fetch(host, {
    method: "POST",
    headers: {
      Authorization: token,
    },
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
