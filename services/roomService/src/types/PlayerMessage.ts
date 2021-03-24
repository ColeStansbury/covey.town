import {nanoid} from 'nanoid';

export default class PlayerMessage {
  set content(value: string) {
    this._content = value;
  }

  get content(): string {
    return this._content;
  }

  get recipient(): 'town' | { userProfileIds: string[] } | { userProfileId: string } {
    return this._recipient;
  }

  get senderProfileId(): string {
    return this._senderProfileId;
  }

  private _content: string;

  private readonly _senderProfileId: string;

  private readonly _senderName: string;

  private readonly _recipient: 'town' | { userProfileIds: string[] } | { userProfileId: string };

  private date: Date;

  private readonly _messageId: string;


  constructor(senderProfileId: string, senderName: string, content: string, date: Date,
    recipient: 'town' | { userProfileIds: string[] } | { userProfileId: string },
  ) {
    this._content = content;
    this._senderProfileId = senderProfileId;
    this._recipient = recipient;
    this.date = date;
    this._messageId = nanoid();
    this._senderName = senderName;
  }

  static fromClientPlayerMessage(playerMessageFromClient: ClientPlayerMessage): PlayerMessage {
    return new PlayerMessage(
      playerMessageFromClient._senderProfileId,
      playerMessageFromClient.senderName,
      playerMessageFromClient._content,
      new Date(playerMessageFromClient.date.getUTCDate()),
      playerMessageFromClient._recipient);
  }

}
export type ClientPlayerMessage = {
  _senderProfileId: string;
  _content: string;
  senderName: string;
  date: Date;
  _recipient: 'town' | { userProfileIds: string[]; date: Date; } | { userProfileId: string },
};
