export type Mail = {
  id?: number;
  title: string;
  sentDate: Date;
  body: string;
  senderId: number;
  receiverId: number;
  senderFirstname: string;
  senderLastname: string;
  senderRole: string;
  opened: boolean;
};

export type MailSend = {
  title: string;
  sentDate: Date;
  body: string;
};
