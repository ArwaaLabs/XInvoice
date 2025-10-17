import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Upload, FileText, Check, Trash2, Plus, Star, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type CompanySettings } from "@shared/schema";

export default function Settings() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { data: companies = [], isLoading } = useQuery<CompanySettings[]>({
    queryKey: ["/api/companies"],
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
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

  // Auto-select primary company or first company on load
  useEffect(() => {
    if (companies.length > 0 && !selectedCompanyId) {
      const primaryCompany = companies.find(c => c.isPrimary === "true");
      setSelectedCompanyId(primaryCompany?.id || companies[0].id);
    }
  }, [companies, selectedCompanyId]);

  // Load selected company data
  useEffect(() => {
    if (isAddingNew) {
      // Reset form for new company
      setCompanyName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setTaxId("");
      setLogo(null);
      setPrimaryColor("#3B82F6");
      setInvoicePrefix("INV");
      setNextNumber(1001);
      setSelectedTemplate("modern");
      setBankName("");
      setAccountNumber("");
      setRoutingCode("");
      setSwiftCode("");
    } else if (selectedCompanyId) {
      const company = companies.find(c => c.id === selectedCompanyId);
      if (company) {
        setCompanyName(company.companyName);
        setEmail(company.email);
        setPhone(company.phone || "");
        setAddress(company.address || "");
        setTaxId(company.taxId || "");
        setLogo(company.logo);
        setPrimaryColor(company.primaryColor || "#3B82F6");
        setInvoicePrefix(company.invoicePrefix || "INV");
        setNextNumber(company.nextInvoiceNumber || 1001);
        setSelectedTemplate(company.template || "modern");
        setBankName(company.bankName || "");
        setAccountNumber(company.accountNumber || "");
        setRoutingCode(company.routingCode || "");
        setSwiftCode(company.swiftCode || "");
      }
    }
  }, [selectedCompanyId, companies, isAddingNew]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: t('settings.missingInfo'),
        description: "Please upload an image file (PNG or JPG).",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: t('settings.missingInfo'),
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

  const handleAddNewCompany = () => {
    setIsAddingNew(true);
    setSelectedCompanyId(null);
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    if (companies.length > 0) {
      const primaryCompany = companies.find(c => c.isPrimary === "true");
      setSelectedCompanyId(primaryCompany?.id || companies[0].id);
    }
  };

  const handleSaveCompany = async () => {
    if (!companyName || !email) {
      toast({
        title: t('settings.missingInfo'),
        description: t('settings.requiredFields'),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const companyData = {
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
      };

      if (isAddingNew) {
        // Create new company
        const response = await apiRequest("POST", "/api/companies", companyData);
        const newCompany = await response.json();
        await queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
        setSelectedCompanyId(newCompany.id);
        setIsAddingNew(false);
        toast({
          title: "Company added",
          description: "New company has been successfully added.",
        });
      } else if (selectedCompanyId) {
        // Update existing company
        await apiRequest("PATCH", `/api/companies/${selectedCompanyId}`, companyData);
        await queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
        toast({
          title: t('settings.saveSuccess'),
          description: t('settings.saveSuccess'),
        });
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('settings.saveError'),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetPrimary = async (companyId: string) => {
    try {
      await apiRequest("POST", `/api/companies/${companyId}/set-primary`);
      await queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Primary company updated",
        description: "This company is now set as your primary company.",
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: "Failed to set primary company.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;

    try {
      await apiRequest("DELETE", `/api/companies/${companyToDelete}`);
      await queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      
      // Select another company after deletion
      if (selectedCompanyId === companyToDelete) {
        setSelectedCompanyId(null);
      }
      
      toast({
        title: "Company deleted",
        description: "Company has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: "Failed to delete company.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        {t('common.loading')}
      </div>
    );
  }

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Company Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Companies</CardTitle>
              <CardDescription>Manage your company profiles</CardDescription>
            </div>
            <Button
              onClick={handleAddNewCompany}
              disabled={isAddingNew}
              data-testid="button-add-new-company"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Select Company</Label>
            <Select
              value={isAddingNew ? "new" : selectedCompanyId || ""}
              onValueChange={(value) => {
                if (value === "new") {
                  handleAddNewCompany();
                } else {
                  setIsAddingNew(false);
                  setSelectedCompanyId(value);
                }
              }}
            >
              <SelectTrigger data-testid="select-company">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {company.companyName}
                      {company.isPrimary === "true" && (
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isAddingNew && (
              <p className="text-sm text-muted-foreground">Creating new company profile</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company" data-testid="tab-company">{t('settings.tabs.company')}</TabsTrigger>
          <TabsTrigger value="invoice" data-testid="tab-invoice">{t('settings.tabs.invoice')}</TabsTrigger>
          <TabsTrigger value="templates" data-testid="tab-templates">{t('settings.tabs.templates')}</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('settings.company.title')}</CardTitle>
                  <CardDescription>
                    {t('settings.company.description')}
                  </CardDescription>
                </div>
                {!isAddingNew && selectedCompanyId && (
                  <div className="flex gap-2">
                    {selectedCompany?.isPrimary !== "true" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimary(selectedCompanyId)}
                        data-testid="button-set-primary"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Set as Primary
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setCompanyToDelete(selectedCompanyId);
                        setDeleteDialogOpen(true);
                      }}
                      disabled={companies.length <= 1}
                      data-testid="button-delete-company"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo">{t('settings.company.logo')}</Label>
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
                        {t('settings.company.uploadLogo')}
                      </Button>
                      {logo && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setLogo(null)}
                          data-testid="button-remove-logo"
                        >
                          {t('settings.company.removeLogo')}
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('settings.company.logoHelp')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">{t('settings.company.companyName')}</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      data-testid="input-company-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('settings.company.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-testid="input-company-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('settings.company.phone')}</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      data-testid="input-company-phone"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">{t('settings.company.taxId')}</Label>
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
                  <Label htmlFor="address">{t('settings.company.address')}</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    data-testid="input-company-address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">{t('settings.company.brandColor')}</Label>
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
                    {t('settings.company.brandColorHelp')}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {isAddingNew && (
                  <Button
                    variant="outline"
                    onClick={handleCancelNew}
                    disabled={isSaving}
                    data-testid="button-cancel-new-company"
                  >
                    Cancel
                  </Button>
                )}
                <Button onClick={handleSaveCompany} disabled={isSaving} data-testid="button-save-company">
                  {isSaving ? t('common.saving') : (isAddingNew ? 'Create Company' : t('common.save'))}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('settings.account.title')}</CardTitle>
              <CardDescription>
                {t('settings.account.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">{t('settings.account.bankName')}</Label>
                  <Input
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g., Chase Bank"
                    data-testid="input-bank-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">{t('settings.account.accountNumber')}</Label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g., 1234567890"
                    data-testid="input-account-number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routingCode">{t('settings.account.routingCode')}</Label>
                  <Input
                    id="routingCode"
                    value={routingCode}
                    onChange={(e) => setRoutingCode(e.target.value.toUpperCase())}
                    placeholder="e.g., JAKA0QAZIGD (IFSC - India)"
                    data-testid="input-routing-code"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('settings.account.routingCodeHelp')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="swiftCode">{t('settings.account.swiftCode')}</Label>
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
                {isSaving ? t('common.saving') : t('common.save')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.invoiceConfig.title')}</CardTitle>
              <CardDescription>
                {t('settings.invoiceConfig.description')}
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

              <Button onClick={handleSaveCompany} disabled={isSaving} data-testid="button-save-invoice-settings">
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
                <Button onClick={handleSaveCompany} disabled={isSaving} data-testid="button-save-template">
                  {isSaving ? "Saving..." : "Save Template"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this company? This action cannot be undone.
              {companyToDelete && selectedCompany?.isPrimary === "true" && (
                <span className="block mt-2 text-yellow-600">
                  Warning: This is your primary company. Another company will be automatically set as primary.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCompany} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
