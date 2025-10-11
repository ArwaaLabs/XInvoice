import { useState } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  totalInvoices: number;
  totalRevenue: number;
};

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");

  const [clients] = useState<Client[]>([
    {
      id: "1",
      name: "Tech Corp",
      email: "contact@techcorp.com",
      phone: "+1 (555) 123-4567",
      address: "456 Business Blvd, New York, NY 10001",
      totalInvoices: 12,
      totalRevenue: 45678,
    },
    {
      id: "2",
      name: "Design Agency",
      email: "hello@designagency.com",
      phone: "+1 (555) 234-5678",
      address: "789 Creative Lane, Los Angeles, CA 90001",
      totalInvoices: 8,
      totalRevenue: 23456,
    },
    {
      id: "3",
      name: "Startup Inc",
      email: "info@startupinc.com",
      address: "321 Innovation Dr, Austin, TX 78701",
      totalInvoices: 5,
      totalRevenue: 12340,
    },
    {
      id: "4",
      name: "Marketing Co",
      email: "team@marketingco.com",
      phone: "+1 (555) 345-6789",
      address: "654 Strategy St, Chicago, IL 60601",
      totalInvoices: 15,
      totalRevenue: 67890,
    },
  ]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
        <Button data-testid="button-add-client">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
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
                      {client.totalInvoices} invoices
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
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
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
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mt-0.5" />
                  <span className="line-clamp-2">{client.address}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <span className="text-lg font-semibold font-mono">
                  ${client.totalRevenue.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
