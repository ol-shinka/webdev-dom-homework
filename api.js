import { getCurrentDate } from "./date.js";

const host = "https://wedev-api.sky.pro/api/v2/:ol-shinka/comments";

export const fetchGet = () => {
  return fetch(host, {
    method: "GET",
  })
  .then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    } else  if (response.status === 500) {
      throw new Error("Сервер не отвечает");
    } else {
      return response.json();
    }    
  })
}


export const fetchPost = (token,inputTextElement,inputNameElement) => {
  return fetch(host, {
    method: "POST",
    body: JSON.stringify({
      name: inputNameElement.value,
      date: getCurrentDate(new Date()),
      text: inputTextElement.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll('QUOTE_BEGIN', "<div class='comment-quote'><b>")
        .replaceAll('QUOTE_END', "</b></div>"),
      isLiked: false,
      likes: 0,
      propertyColorLike: 'like-button no-active-like',
      forceError: true,
    }),
    headers: {
      Authorization: token,
  }
  })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Сервер упал");
      } else if (response.status === 400) {
        throw new Error("Некорректный запрос");
      } else {
        return response.json();
      }
    })

}

export function fetchDelete(token,id) {
  return fetch(host + id, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        return response.json();
      })
}

export const loginUser = ({login, password}) => {
  return fetch("https://wedev-api.sky.pro/api/user/login", {
    method: "POST",
    body: JSON.stringify({
     login,
     password
    })
  })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Сервер упал");
      } else if (response.status === 400) {
        throw new Error("Нет авторизации");
      } else {
        return response.json();
      }
    })

}

export const registerUser = ({login, password,name}) => {
  return fetch("https://wedev-api.sky.pro/api/user", {
    method: "POST",
    body: JSON.stringify({
     login,
     password,
     name,
    })
  })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Сервер упал");
      } else if (response.status === 400) {
        throw new Error("Пользователь с таким именем уже существует");
      } else {
        return response.json();
      }
    })

}

export const memoryLike = ({id, token}) => {
  return fetch(`https://wedev-api.sky.pro/api/v2/ol-shinka/comments/${id}/toggle-like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    return response.json();
  });
}
