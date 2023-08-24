export interface Message {
  id: number;
  senderId: number;
  senderEmail: string;
  recipientId: number;
  recipientEmail: string;
  content: string;
  dateRead?: Date;
  messageSent: Date;
}
