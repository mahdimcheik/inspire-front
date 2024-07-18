export type SentMail = {
  id?: number;
  title: string;
  sentDate: Date;
  body: string;
  senderId: number;
  receiverId: number;
  receiverFirstname: string;
  receiverLastname: string;
  role: string;
  imgUrl: string;
  senderRole: string;
  opened: boolean;
};

export type ReceivedMail = {
  id?: number;
  title: string;
  sentDate: Date;
  body: string;
  senderId: number;
  receiverId: number;
  senderFirstname: string;
  senderLastname: string;
  imgUrl: string;
  senderRole: string;
  opened: boolean;
};

export type MailSend = {
  title: string;
  receiverId: number;
  body: string;
};
