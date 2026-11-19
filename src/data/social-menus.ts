import { social } from './catalog';

/** The Instagram and X menus, shared by the top bar and the silo panels. */
export const socialMenus = [
  { id: 'instagram' as const, title: 'Instagram', accounts: social.instagram },
  { id: 'twitter' as const, title: 'X / Twitter', accounts: social.twitter },
];

/** A silo's own Instagram / X account, looked up by name in `social`. */
export const accountFor = (menu: (typeof socialMenus)[number], name: string) =>
  menu.accounts.find((a) => a.name === name);
