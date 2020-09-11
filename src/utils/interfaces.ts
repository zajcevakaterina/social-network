export interface IAuthor {
  id: number,
  name: string,
  avatar: string
}

export interface IMessageItem {
  ts: number | string,
  messageId: string,
  author: IAuthor,
  message: string,
  likes: any[]
}

export interface IInitialChat {
  [key: string]: IMessageItem
}