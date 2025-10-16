import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Users, Settings } from "lucide-react";
import { SiGoogle, SiGithub, SiLinkedin } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Premium Hero Section */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center space-y-10 max-w-5xl mx-auto animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-20 w-20 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-2xl">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              InvoiceGenius
            </h1>
          </div>
          
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl font-medium leading-relaxed">
            Professional invoice generation made <span className="text-primary font-semibold">simple</span>. Create beautiful invoices with multi-currency support, tax calculations, and PDF export.
          </p>

          <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-base text-muted-foreground font-semibold uppercase tracking-wide">Sign in with your preferred account</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => window.location.href = "/api/login/google"}
                data-testid="button-login-google"
                className="gap-3 shadow-lg hover:shadow-xl text-base px-8 h-12"
              >
                <SiGoogle className="h-5 w-5" />
                Continue with Google
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/api/login/github"}
                data-testid="button-login-github"
                className="gap-3 shadow-lg hover:shadow-xl text-base px-8 h-12"
              >
                <SiGithub className="h-5 w-5" />
                Continue with GitHub
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/api/login/linkedin"}
                data-testid="button-login-linkedin"
                className="gap-3 shadow-lg hover:shadow-xl text-base px-8 h-12"
              >
                <SiLinkedin className="h-5 w-5" />
                Continue with LinkedIn
              </Button>
            </div>
          </div>
        </div>

        {/* Premium Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-32 animate-slide-in-from-bottom">
          <Card className="hover:scale-105 transition-transform duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Multi-Currency</CardTitle>
              <CardDescription className="mt-3">
                Support for USD, EUR, GBP, JPY and more with proper currency grouping
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">PDF Export</CardTitle>
              <CardDescription className="mt-3">
                Download professional PDFs with customizable templates and branding
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Client Management</CardTitle>
              <CardDescription className="mt-3">
                Organize clients with contact details and track revenue per client
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Customizable</CardTitle>
              <CardDescription className="mt-3">
                Add your logo, colors, and company details to match your brand
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Premium Additional Features */}
        <div className="mt-32 max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl">
            <CardHeader className="bg-gradient-subtle text-center pb-8">
              <CardTitle className="text-3xl">Everything you need to manage invoices</CardTitle>
              <CardDescription className="text-lg mt-4">
                Built for professionals who value simplicity and efficiency
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Tax Calculations</h4>
                    <p className="text-sm text-muted-foreground mt-1">Automatic tax calculations per line item with customizable rates</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Discounts</h4>
                    <p className="text-sm text-muted-foreground mt-1">Percentage or fixed amount discounts per item</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Status Tracking</h4>
                    <p className="text-sm text-muted-foreground mt-1">Draft, sent, paid, and overdue status management</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Dashboard Analytics</h4>
                    <p className="text-sm text-muted-foreground mt-1">Track revenue, pending payments, and performance metrics</p>
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
