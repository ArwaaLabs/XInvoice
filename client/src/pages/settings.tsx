import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const [companyName, setCompanyName] = useState("Design Studio Inc.");
  const [email, setEmail] = useState("hello@designstudio.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [address, setAddress] = useState("123 Creative Ave, San Francisco, CA 94102");
  const [invoicePrefix, setInvoicePrefix] = useState("INV");
  const [nextNumber, setNextNumber] = useState(1001);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your company information and preferences
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company" data-testid="tab-company">Company Info</TabsTrigger>
          <TabsTrigger value="invoice" data-testid="tab-invoice">Invoice Settings</TabsTrigger>
          <TabsTrigger value="templates" data-testid="tab-templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                This information will appear on your invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo">Company Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button variant="outline" data-testid="button-upload-logo">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended size: 200x200px. PNG or JPG format.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      data-testid="input-company-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-testid="input-company-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      data-testid="input-company-phone"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID (Optional)</Label>
                    <Input id="taxId" placeholder="XX-XXXXXXX" data-testid="input-tax-id" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    data-testid="input-company-address"
                  />
                </div>
              </div>

              <Button data-testid="button-save-company">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Configuration</CardTitle>
              <CardDescription>
                Customize how your invoices are numbered and formatted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    data-testid="input-invoice-prefix"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will appear before the invoice number (e.g., INV-1001)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextNumber">Next Invoice Number</Label>
                  <Input
                    id="nextNumber"
                    type="number"
                    value={nextNumber}
                    onChange={(e) => setNextNumber(parseInt(e.target.value))}
                    data-testid="input-next-number"
                  />
                  <p className="text-xs text-muted-foreground">
                    The next invoice will be numbered {invoicePrefix}-{nextNumber}
                  </p>
                </div>
              </div>

              <Button data-testid="button-save-invoice-settings">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Modern", "Classic", "Minimal"].map((template) => (
              <Card key={template} className="hover-elevate cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{template}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[3/4] bg-muted rounded-md flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <Button className="w-full mt-4" variant="outline" data-testid={`button-select-${template.toLowerCase()}`}>
                    Select Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
