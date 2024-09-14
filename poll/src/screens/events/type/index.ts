export enum Status {
  Active = 'active',
  Finished = 'finished',
}

export enum Role {
  Public = 'public',
  Private = 'private',
}

export type PollEvent = {
  id: number;
  uid: string;
  name: string;
  creator: string;
  options: string[];
  remained_ticket: number;
  ticket: number;
  image_url: string;
};
