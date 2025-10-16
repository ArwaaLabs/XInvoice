import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageProvider } from "@/hooks/useLanguage";
import { LanguageSelector } from "@/components/language-selector";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import Dashboard from "@/pages/dashboard";
import InvoiceEditor from "@/pages/invoice-editor";
import Invoices from "@/pages/invoices";
import Clients from "@/pages/clients";
import Settings from "@/pages/settings";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/invoice/new" component={InvoiceEditor} />
      <Route path="/invoice/:id" component={InvoiceEditor} />
      <Route path="/invoices" component={Invoices} />
      <Route path="/clients" component={Clients} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <AuthenticatedApp style={style} />
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AuthenticatedApp({ style }: { style: Record<string, string> }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return <Router />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-4">
              <UserMenu />
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function UserMenu() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      {user.profileImageUrl && (
        <img 
          src={user.profileImageUrl} 
          alt={user.firstName || "User"} 
          className="h-8 w-8 rounded-full object-cover"
        />
      )}
      <div className="flex flex-col items-end">
        {(user.firstName || user.lastName) && (
          <span className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </span>
        )}
      </div>
      <button
        onClick={() => window.location.href = "/api/logout"}
        className="text-sm text-muted-foreground hover:text-foreground"
        data-testid="button-logout"
      >
        {t('nav.logout')}
      </button>
    </div>
  );
}

export default App;
