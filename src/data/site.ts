import type { NavItem, SiteConfig } from '@/types/site';

export const navItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '博客', href: '/blog' },
  { label: '专题书架', href: '/shelves' },
  { label: '游戏', href: '/games' },
  { label: '馆藏分类', href: '/catalog' },
  { label: '关于此博客', href: '/about' },
  { label: 'RPG浏览', href: '/rpg' },
];

export const siteConfig: SiteConfig = {
  title: '这很调和的博客',
  description: '一个用来写东西、做项目、顺手归档的个人博客。',
  subtitle: 'Notes, projects, and small games.',
  navItems,
};
