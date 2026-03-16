export function labelStatus(status: string) {
  switch (status) {
    case 'idea':
      return '构思中';
    case 'published':
      return '已发布';
    default:
      return '试作中';
  }
}
