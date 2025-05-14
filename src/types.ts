export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: string;
}