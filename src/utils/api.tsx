import { IMessageItem } from './interfaces'

const config = {
  workChatUrl: 'https://social-network-55432.firebaseio.com/workChat',
  floodChatUrl: 'https://social-network-55432.firebaseio.com/floodChat',
  headers: {
    'Content-Type': 'application/json',
  }
};

type Options = {
  workChatUrl: string,
  floodChatUrl: string,
  headers:  {
    'Content-Type': string,
  }
}

class Api {
  workChatUrl: string;
  floodChatUrl: string;
  headers: Headers | string[][] | { [key: string]: string; };
  constructor(options: Options) {
    this.workChatUrl = options.workChatUrl;
    this.floodChatUrl = options.floodChatUrl;
    this.headers = options.headers;
  }

  _handleResponse(response: any) {
    if (response.ok) {
      return response.json();
    } else {
      console.log(`Ошибка: ${response.status}`)
      return Promise.reject(response.statusText)
    }
  }

  _handleResponseError(error: Error) {
    console.log(`Ошибка: ${error.message}`)
    return Promise.reject(error.message)
  }

  getChat(chatType: string) {
    if (chatType === 'work') {
      return fetch(`${this.workChatUrl}.json`, {
        method: 'GET',
        headers: this.headers
      })
        .then(this._handleResponse)
        .catch(this._handleResponseError);
    } else {
      return fetch(`${this.floodChatUrl}.json`, {
        method: 'GET',
        headers: this.headers
      })
        .then(this._handleResponse)
        .catch(this._handleResponseError);
    }
  }

  addMessage(message:IMessageItem, chatType: string) {
    const body = JSON.stringify(message);
    if (chatType === 'work') {
      return fetch(`${this.workChatUrl}/${message.messageId}.json`, {
        method: 'PUT',
        body: body
      })
        .then(this._handleResponse)
        .catch(this._handleResponseError);
    } else {
      return fetch(`${this.floodChatUrl}/${message.messageId}.json`, {
        method: 'PUT',
        body: body
      })
        .then(this._handleResponse)
        .catch(this._handleResponseError);
    }
  }

  deleteMessage(messageId: string, chatType: string) {
    if (chatType === 'work') {
      return fetch(`${this.workChatUrl}/${messageId}.json`, {
        method: 'DELETE',
        headers: this.headers,
      })
        .then(this._handleResponse)
        .catch(this._handleResponseError);
    } else {
      return fetch(`${this.floodChatUrl}/${messageId}.json`, {
        method: 'DELETE',
        headers: this.headers,
      })
        .then(this._handleResponse)
        .catch(this._handleResponseError);
    }
  }

  changeMessage(message:IMessageItem, chatType: string) {
    const body = JSON.stringify(message);

    if (chatType === 'work') {
      return fetch(`${this.workChatUrl}/${message.messageId}.json`, {
        method: 'PUT',
        headers: this.headers,
        body: body
      })
        .then(this._handleResponse)
        .catch(this._handleResponseError);
    } else {
      return fetch(`${this.floodChatUrl}/${message.messageId}.json`, {
        method: 'PUT',
        headers: this.headers,
        body: body
      })
        .then(this._handleResponse)
        .catch(this._handleResponseError);
    }
  }
}

const api = new Api(config);
export default api;
