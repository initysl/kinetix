export interface Author {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  image: string;
  likes: number;
  author: Author;
}

export interface StoryCard {
  id: string;
  title: string;
  image: string;
  likes: number;
}
