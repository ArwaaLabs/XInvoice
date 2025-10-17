import { useState } from "react";
import { Check, ChevronsUpDown, Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CompanySettings } from "@shared/schema";

export type { CompanySettings };

type CompanySelectorProps = {
  companies: CompanySettings[];
  value?: string;
  onSelect: (companyId: string) => void;
  onAddCompany: (company: Omit<CompanySettings, "id" | "userId" | "isPrimary" | "isActive" | "createdAt">) => void;
};

export function CompanySelector({ companies, value, onSelect, onAddCompany }: CompanySelectorProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");

  const selectedCompany = companies.find((c) => c.id === value);

  const handleAddCompany = () => {
    if (!companyName || !email) return;

    onAddCompany({
      companyName,
      email,
      phone: phone || null,
      address: address || null,
      taxId: taxId || null,
      logo: null,
      primaryColor: "#3B82F6",
      invoicePrefix: "INV",
      nextInvoiceNumber: 1001,
      template: "modern",
      bankName: null,
      accountNumber: null,
      routingCode: null,
      swiftCode: null,
    });

    // Reset form
    setCompanyName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setTaxId("");
    setDialogOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            data-testid="button-select-company"
          >
            {selectedCompany ? (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{selectedCompany.companyName}</span>
              </div>
            ) : (
              "Select company..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search company..." />
            <CommandList>
              <CommandEmpty>No company found.</CommandEmpty>
              <CommandGroup>
                {companies.map((company) => (
                  <CommandItem
                    key={company.id}
                    value={company.id}
                    onSelect={() => {
                      onSelect(company.id);
                      setOpen(false);
                    }}
                    data-testid={`company-item-${company.id}`}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === company.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {company.companyName}
                        {company.isPrimary === "true" && (
                          <span className="ml-2 text-xs text-muted-foreground">(Primary)</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{company.email}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setDialogOpen(true);
                    setOpen(false);
                  }}
                  data-testid="button-add-company"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add new company
                </Button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>
              Create a new company profile for your invoices.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-company-name">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Inc."
                data-testid="input-new-company-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-company-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-company-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="billing@acme.com"
                data-testid="input-new-company-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-company-phone">Phone</Label>
              <Input
                id="new-company-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                data-testid="input-new-company-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-company-taxId">Tax ID</Label>
              <Input
                id="new-company-taxId"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="XX-XXXXXXX"
                data-testid="input-new-company-taxid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-company-address">Address</Label>
              <Textarea
                id="new-company-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Business St, City, State 12345"
                rows={2}
                data-testid="input-new-company-address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-testid="button-cancel-add-company"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCompany}
              disabled={!companyName || !email}
              data-testid="button-save-new-company"
            >
              Add Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
