export interface SubItem {
  label: string;
  path: string;
}

export interface NavItem {
  label: string;
  path?: string;
  subItems?: SubItem[];
}
