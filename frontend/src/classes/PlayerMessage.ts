import {nanoid} from "nanoid";

export default class PlayerMessage {
  set content(value: string) {
    this._content = value;
  }

  get content(): string {
    return this._content;
  }

  get recipient(): "town" | { recipientId: string } {
    return this._recipient;
  }

  get senderProfileId(): string {
    return this._senderProfileId;
  }

  get date(): Date {
    return this._date;
  }

  get senderName(): string {
    return this._senderName;
  }

  get messageId(): string {
    return this._messageId;
  }

  private _content: string;

  private readonly _senderProfileId: string;

  private readonly _senderName: string;

  private readonly _recipient: "town" | { recipientId: string };

  private readonly _date: Date;

  private readonly _messageId: string;


  constructor(content: string, senderProfileId: string, recipient: "town" | { recipientId: string }, senderName: string, date: Date) {
    this._content = content;
    this._senderProfileId = senderProfileId;
    this._recipient = recipient;
    this._date = date;
    this._messageId = nanoid();
    this._senderName = senderName;
  }
}
