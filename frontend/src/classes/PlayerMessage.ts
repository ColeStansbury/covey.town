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


  private _content: string;

  private readonly _senderProfileId: string;

  private readonly _senderName: string;

  private readonly _recipient: "town" | { recipientId: string };

  private readonly date: Date;

  private readonly _messageId: string;


  constructor(content: string, senderProfileId: string, recipient: "town" | { recipientId: string }, senderName: string) {
    this._content = content;
    this._senderProfileId = senderProfileId;
    this._recipient = recipient;
    this.date = new Date();
    this._messageId = nanoid();
    this._senderName = senderName;
  }
}
