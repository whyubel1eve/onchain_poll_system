export interface PollEvent {
  id: number;
  uid: string;
  name: string;
  creator: string;
  options: string[];
  ticket: number;
  remained_ticket: number;
  image_url: string;
  hash: string;
}
