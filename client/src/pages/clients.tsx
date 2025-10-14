import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Mail, Phone, MapPin, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address: string | null;
  taxId?: string | null;
};

type Invoice = {
  id: string;
  clientId: string;
  currency?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: string;
    discount: string;
    discountType: string;
    taxRate: string;
  }>;
};

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const { toast } = useToast();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: invoices = [] } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientStats = (clientId: string) => {
    const clientInvoices = invoices.filter(inv => inv.clientId === clientId);
    
    const revenueByCurrency = clientInvoices.reduce((acc, inv) => {
      const currency = inv.currency || "USD";
      const total = inv.items.reduce((itemSum, item) => {
        const subtotal = item.quantity * parseFloat(item.unitPrice);
        let discountAmount = 0;
        if (item.discountType === "percentage") {
          discountAmount = (subtotal * parseFloat(item.discount)) / 100;
        } else {
          discountAmount = parseFloat(item.discount);
        }
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = (afterDiscount * parseFloat(item.taxRate)) / 100;
        return itemSum + afterDiscount + taxAmount;
      }, 0);
      
      acc[currency] = (acc[currency] || 0) + total;
      return acc;
    }, {} as Record<string, number>);

    const getCurrencySymbol = (code: string) => {
      const map: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", JPY: "¥" };
      return map[code] || code;
    };

    const revenueDisplay = Object.entries(revenueByCurrency)
      .map(([curr, amt]) => `${getCurrencySymbol(curr)}${Math.round(amt).toLocaleString()}`)
      .join(" + ") || "$0";

    return {
      totalInvoices: clientInvoices.length,
      revenueDisplay,
    };
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const openAddDialog = () => {
    setEditingClient(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      address: client.address || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingClient) {
        await apiRequest("PATCH", `/api/clients/${editingClient.id}`, formData);
        toast({
          title: "Client updated",
          description: "Client information has been successfully updated.",
        });
      } else {
        await apiRequest("POST", "/api/clients", formData);
        toast({
          title: "Client added",
          description: "New client has been successfully added.",
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingClient ? "update" : "add"} client.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiRequest("DELETE", `/api/clients/${id}`);
      await queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Client deleted",
        description: "Client has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your client information and history
          </p>
        </div>
        <Button onClick={openAddDialog} data-testid="button-add-client">
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          data-testid="input-search-clients"
        />
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Loading clients...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => {
            const stats = getClientStats(client.id);
            return (
              <Card key={client.id} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(client.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold" data-testid={`text-client-${client.id}`}>{client.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {stats.totalInvoices} invoices
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-menu-${client.id}`}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(client)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(client.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mt-0.5" />
                        <span className="line-clamp-2">{client.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                    <span className="text-lg font-semibold font-mono">
                      {stats.revenueDisplay}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
            <DialogDescription>
              {editingClient ? "Update client information" : "Create a new client to add to your invoices"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                placeholder="Acme Corporation"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-client-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@acme.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-client-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                data-testid="input-client-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="123 Main St, City, State 12345"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                data-testid="input-client-address"
              />
            </div>
            <Button onClick={handleSave} className="w-full" data-testid="button-save-client">
              {editingClient ? "Update Client" : "Add Client"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
