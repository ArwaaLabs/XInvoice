import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

type CompanySettings = {
  id: string;
  companyName: string;
  email: string;
  phone: string | null;
  address: string | null;
  taxId: string | null;
  logo: string | null;
  primaryColor: string | null;
  invoicePrefix: string | null;
  nextInvoiceNumber: number | null;
};

export default function Settings() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<CompanySettings>({
    queryKey: ["/api/settings"],
  });

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [nextNumber, setNextNumber] = useState(1001);

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName);
      setEmail(settings.email);
      setPhone(settings.phone || "");
      setAddress(settings.address || "");
      setTaxId(settings.taxId || "");
      setInvoicePrefix(settings.invoicePrefix || "INV");
      setNextNumber(settings.nextInvoiceNumber || 1001);
    }
  }, [settings]);

  const handleSaveCompany = async () => {
    try {
      await apiRequest("POST", "/api/settings", {
        companyName,
        email,
        phone,
        address,
        taxId,
        invoicePrefix: settings?.invoicePrefix || "INV",
        nextInvoiceNumber: settings?.nextInvoiceNumber || 1001,
      });
      await queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "Company information has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    }
  };

  const handleSaveInvoice = async () => {
    try {
      await apiRequest("POST", "/api/settings", {
        companyName: settings?.companyName || "",
        email: settings?.email || "",
        phone: settings?.phone,
        address: settings?.address,
        taxId: settings?.taxId,
        invoicePrefix,
        nextInvoiceNumber: nextNumber,
      });
      await queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "Invoice settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        Loading settings...
      </div>
    );
  }

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
                    <Input
                      id="taxId"
                      placeholder="XX-XXXXXXX"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      data-testid="input-tax-id"
                    />
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

              <Button onClick={handleSaveCompany} data-testid="button-save-company">Save Changes</Button>
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
                    onChange={(e) => setNextNumber(parseInt(e.target.value) || 1001)}
                    data-testid="input-next-number"
                  />
                  <p className="text-xs text-muted-foreground">
                    The next invoice will be numbered {invoicePrefix}-{nextNumber}
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveInvoice} data-testid="button-save-invoice-settings">Save Changes</Button>
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
