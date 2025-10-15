import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Users, Settings } from "lucide-react";
import { SiGoogle, SiGithub, SiLinkedin } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              Invoice Pro
            </h1>
          </div>
          
          <p className="text-2xl text-muted-foreground max-w-2xl">
            Professional invoice generation made simple. Create beautiful invoices with multi-currency support, tax calculations, and PDF export.
          </p>

          <div className="flex flex-col items-center gap-3 mt-8">
            <p className="text-sm text-muted-foreground mb-2">Sign in with your preferred account</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => window.location.href = "/api/login?provider=google"}
                data-testid="button-login-google"
                className="gap-2"
              >
                <SiGoogle className="h-5 w-5" />
                Google
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/api/login?provider=github"}
                data-testid="button-login-github"
                className="gap-2"
              >
                <SiGithub className="h-5 w-5" />
                GitHub
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/api/login/linkedin"}
                data-testid="button-login-linkedin"
                className="gap-2"
              >
                <SiLinkedin className="h-5 w-5" />
                LinkedIn
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          <Card>
            <CardHeader>
              <DollarSign className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Multi-Currency</CardTitle>
              <CardDescription>
                Support for USD, EUR, GBP, JPY and more with proper currency grouping
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>PDF Export</CardTitle>
              <CardDescription>
                Download professional PDFs with customizable templates and branding
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                Organize clients with contact details and track revenue per client
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Customizable</CardTitle>
              <CardDescription>
                Add your logo, colors, and company details to match your brand
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="mt-24 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Everything you need to manage invoices</CardTitle>
              <CardDescription className="text-base mt-4">
                Built for professionals who value simplicity and efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Tax Calculations</h4>
                    <p className="text-sm text-muted-foreground">Automatic tax calculations per line item</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Discounts</h4>
                    <p className="text-sm text-muted-foreground">Percentage or fixed amount discounts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Status Tracking</h4>
                    <p className="text-sm text-muted-foreground">Draft, sent, paid, and overdue status</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Dashboard Analytics</h4>
                    <p className="text-sm text-muted-foreground">Track revenue and pending payments</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
