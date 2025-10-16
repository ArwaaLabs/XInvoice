import { Home, FileText, Users, Settings, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    titleKey: "nav.dashboard",
    url: "/",
    icon: Home,
  },
  {
    titleKey: "nav.invoices",
    url: "/invoices",
    icon: FileText,
  },
  {
    titleKey: "nav.clients",
    url: "/clients",
    icon: Users,
  },
  {
    titleKey: "nav.settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { t } = useTranslation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-premium shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{t('appName')}</h2>
            <p className="text-xs text-sidebar-foreground/70 font-medium">{t('appTagline')}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 mb-2">
            {t('nav.dashboard')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.titleKey.split('.')[1]}`}
                    className="rounded-lg transition-all duration-200 hover:bg-sidebar-accent"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button className="w-full shadow-md hover:shadow-lg" size="lg" data-testid="button-new-invoice">
          <Plus className="h-5 w-5 mr-2" />
          {t('dashboard.newInvoice')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
