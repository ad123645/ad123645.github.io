export interface PostMeta {
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt?: Date;
  tags: string[];
  draft: boolean;
  cover?: string;
}
