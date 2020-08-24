const config = {
  baseUrl: 'https://social-netvork.firebaseio.com/',
  headers: {
  //   authorization: 'ac8eea58-1ab3-4780-8fbf-f684bd9ab1b3',
    'Content-Type': 'application/json'
  }
};

class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  _handleResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      console.log(`Ошибка: ${response.status}`)
      return Promise.reject(response.statusText)
    }
  }

  _handleResponseError(error) {
    console.log(`Ошибка: ${error.message}`)
    return Promise.reject(error.message)
  }

  getWorkChat() {
    return fetch(`${this.baseUrl}/workChat.json`, {
      headers: this.headers
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError);
  }

  getFloodChat() {
    return fetch(`${this.baseUrl}/floodChat.json`, {
      headers: this.headers
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError);
  }

  // setUserInfo(name, job) {
  //   return fetch(`${this.baseUrl}/users/me`, {
  //     method: 'PATCH',
  //     headers: this.headers,
  //     body: JSON.stringify({
  //       name: name,
  //       about: job,
  //     })
  //   })
  //     .then(this._handleResponse)
  //     .catch(this._handleResponseError)
  // }

  // setUserAvatar(link) {
  //   return fetch(`${this.baseUrl}/users/me/avatar`, {
  //     method: 'PATCH',
  //     headers: this.headers,
  //     body: JSON.stringify({
  //       avatar: link
  //     })
  //   })
  //     .then(this._handleResponse)
  //     .catch(this._handleResponseError)
  // }

  // getInitialCards() {
  //   return fetch(`${this.baseUrl}/cards`, {
  //     headers: this.headers
  //   })
  //     .then(this._handleResponse)
  //     .catch(this._handleResponseError);
  // }

  addWorkMessage(message) {
    const body = JSON.stringify(message);
    console.log(body)
    return fetch(`${this.baseUrl}/workChat.json`, {
      method: 'POST',
      body: body
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError);
  }

  // deleteCard(cardId) {
  //   return fetch(`${this.baseUrl}/cards/${cardId}`, {
  //     method: 'DELETE',
  //     headers: this.headers,
  //   })
  //     .then(this._handleResponse)
  //     .catch(this._handleResponseError);
  // }

  // changeLikeCardStatus(cardId, isLiked) {
  //   if (isLiked) {
  //     return fetch(`${this.baseUrl}/cards/likes/${cardId}`, {
  //       method: 'PUT',
  //       headers: this.headers,
  //     })
  //       .then(this._handleResponse)
  //       .catch(this._handleResponseError);
  //   }
  //   return fetch(`${this.baseUrl}/cards/likes/${cardId}`, {
  //     method: 'DELETE',
  //     headers: this.headers,
  //   })
  //     .then(this._handleResponse)
  //     .catch(this._handleResponseError);
  // }

}

const api = new Api(config);
export default api;
