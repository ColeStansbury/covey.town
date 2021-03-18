export default class PlayerMessage {
  set content(value: string) {
    this._content = value;
  }

  get content(): string {
    return this._content;
  }

  get recipient(): 'town' | { userProfileIds: string[] } {
    return this._recipient;
  }

  get senderProfileId(): string {
    return this._senderProfileId;
  }


  private _content: string;

  private readonly _senderProfileId: string;

  private readonly _recipient: 'town' | { userProfileIds: string[] };

  private readonly date: Date;


  constructor(content: string, senderProfileId: string, recipient: 'town' | { userProfileIds: string[] }) {
    this._content = content;
    this._senderProfileId = senderProfileId;
    this._recipient = recipient;
    this.date = new Date();
  }

  static fromClientPlayerMessage(playerMessageFromClient: ClientPlayerMessage): PlayerMessage {
    return new PlayerMessage(playerMessageFromClient._senderProfileId,
      playerMessageFromClient._content, playerMessageFromClient._recipient);
  }

}
export type ClientPlayerMessage = {
  _content: string; _senderProfileId: string;
  _recipient: 'town' | { userProfileIds: string[]; date: Date; }
};
