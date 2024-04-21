export enum QueryKeys {
  me = "me",
  videos = "videos",
}

export interface Me {
  _id: string;
  email: string;
  username: string;
}

export interface Video {
  _id: string;
  owner: string;
  published: boolean;
  videoId: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnail: string;
  sourceCode: string;
  thumbnailExt: string;
  __v: number;
  extension: string;
  description: string;
  title: string;
}
