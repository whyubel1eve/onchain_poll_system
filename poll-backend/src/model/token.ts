export interface Token {
  id: number;
  event_id: number;
  hash: string;
  r: string;
  s: string;
  v: number;
  isIssued: boolean;
}
