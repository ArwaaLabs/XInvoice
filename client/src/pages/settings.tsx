import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Upload, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { type CompanySettings } from "@shared/schema";

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
  const [logo, setLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [nextNumber, setNextNumber] = useState(1001);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingCode, setRoutingCode] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName);
      setEmail(settings.email);
      setPhone(settings.phone || "");
      setAddress(settings.address || "");
      setTaxId(settings.taxId || "");
      setLogo(settings.logo);
      setPrimaryColor(settings.primaryColor || "#3B82F6");
      setInvoicePrefix(settings.invoicePrefix || "INV");
      setNextNumber(settings.nextInvoiceNumber || 1001);
      setSelectedTemplate(settings.template || "modern");
      setBankName(settings.bankName || "");
      setAccountNumber(settings.accountNumber || "");
      setRoutingCode(settings.routingCode || "");
      setSwiftCode(settings.swiftCode || "");
    }
  }, [settings]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (PNG or JPG).",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCompany = async () => {
    if (!companyName || !email) {
      toast({
        title: "Missing information",
        description: "Company name and email are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/settings", {
        companyName,
        email,
        phone: phone || null,
        address: address || null,
        taxId: taxId || null,
        logo: logo || null,
        primaryColor,
        invoicePrefix,
        nextInvoiceNumber: nextNumber,
        template: selectedTemplate,
        bankName: bankName || null,
        accountNumber: accountNumber || null,
        routingCode: routingCode || null,
        swiftCode: swiftCode || null,
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveInvoice = async () => {
    if (!invoicePrefix) {
      toast({
        title: "Missing information",
        description: "Invoice prefix is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/settings", {
        companyName,
        email,
        phone: phone || null,
        address: address || null,
        taxId: taxId || null,
        logo: logo || null,
        primaryColor,
        invoicePrefix,
        nextInvoiceNumber: nextNumber,
        template: selectedTemplate,
        bankName: bankName || null,
        accountNumber: accountNumber || null,
        routingCode: routingCode || null,
        swiftCode: swiftCode || null,
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/settings", {
        companyName,
        email,
        phone: phone || null,
        address: address || null,
        taxId: taxId || null,
        logo: logo || null,
        primaryColor,
        invoicePrefix,
        nextInvoiceNumber: nextNumber,
        template: selectedTemplate,
        bankName: bankName || null,
        accountNumber: accountNumber || null,
        routingCode: routingCode || null,
        swiftCode: swiftCode || null,
      });
      await queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Template saved",
        description: "Invoice template has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted overflow-hidden">
                      {logo ? (
                        <img src={logo} alt="Company logo" className="h-full w-full object-contain" />
                      ) : (
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/png,image/jpeg,image/jpg"
                        className="hidden"
                        data-testid="input-logo-file"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-upload-logo"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                      {logo && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setLogo(null)}
                          data-testid="button-remove-logo"
                        >
                          Remove Logo
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended size: 200x200px. PNG or JPG format. Max 2MB.
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

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Brand Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="primaryColor"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-20 rounded-md border border-input cursor-pointer"
                      data-testid="input-primary-color"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1"
                      data-testid="input-color-hex"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This color will be used for branding elements on your invoices
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveCompany} disabled={isSaving} data-testid="button-save-company">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Bank account details for payment instructions on invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g., Chase Bank"
                    data-testid="input-bank-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g., 1234567890"
                    data-testid="input-account-number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routingCode">Routing/Sort Code</Label>
                  <Input
                    id="routingCode"
                    value={routingCode}
                    onChange={(e) => setRoutingCode(e.target.value)}
                    placeholder="e.g., IFSC (India), Routing (US), Sort Code (UK)"
                    data-testid="input-routing-code"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your bank routing code: IFSC (India), Routing Number (US), Sort Code (UK), etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="swiftCode">Swift Code</Label>
                  <Input
                    id="swiftCode"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    placeholder="e.g., JAKAINB"
                    data-testid="input-swift-code"
                  />
                </div>
              </div>

              <Button onClick={handleSaveCompany} disabled={isSaving} data-testid="button-save-account-info">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
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

              <Button onClick={handleSaveInvoice} disabled={isSaving} data-testid="button-save-invoice-settings">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Template</CardTitle>
              <CardDescription>
                Choose a template design for your invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["modern", "classic", "minimal"].map((template) => {
                  const isSelected = selectedTemplate === template;
                  return (
                    <Card 
                      key={template} 
                      className={`hover-elevate cursor-pointer relative ${isSelected ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedTemplate(template)}
                      data-testid={`card-template-${template}`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg capitalize">{template}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-[3/4] bg-muted rounded-md flex items-center justify-center border">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                          {template === "modern" && "Clean and professional design with bold headers"}
                          {template === "classic" && "Traditional layout with elegant typography"}
                          {template === "minimal" && "Simple and straightforward invoice format"}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Selected template: <span className="font-medium capitalize">{selectedTemplate}</span>
                </p>
                <Button onClick={handleSaveTemplate} disabled={isSaving} data-testid="button-save-template">
                  {isSaving ? "Saving..." : "Save Template"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
