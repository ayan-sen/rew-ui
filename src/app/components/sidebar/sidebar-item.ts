export interface SideBarItem {
    displayName: string;
    disabled?: boolean;
    iconName: string;
    route?: string;
    children?: SideBarItem[];
  }
  