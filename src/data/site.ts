import type { NavItem, SiteConfig } from '@/types/site';

export const navItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '博客', href: '/blog' },
  { label: '书架', href: '/shelves' },
  { label: '游戏', href: '/games' },
  { label: '馆藏', href: '/catalog' },
  { label: '关于', href: '/about' },
  { label: 'RPG', href: '/rpg' },
];

export const siteConfig: SiteConfig = {
  title: '这很调和',
  description: '一个带有阅览室与档案馆气质的个人博客。',
  subtitle: 'Reading room, private archive, small games.',
  navItems,
};
