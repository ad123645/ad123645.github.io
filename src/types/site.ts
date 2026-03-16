export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  subtitle: string;
  navItems: NavItem[];
}
