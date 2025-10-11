import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type Client = {
  id: string;
  name: string;
  email: string;
  address: string;
};

type ClientSelectorProps = {
  clients: Client[];
  value?: string;
  onSelect: (clientId: string) => void;
  onAddClient?: (client: Omit<Client, "id">) => void;
};

export function ClientSelector({
  clients,
  value,
  onSelect,
  onAddClient,
}: ClientSelectorProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    address: "",
  });

  const selectedClient = clients.find((client) => client.id === value);

  const handleAddClient = () => {
    if (onAddClient && newClient.name && newClient.email) {
      onAddClient(newClient);
      setNewClient({ name: "", email: "", address: "" });
      setDialogOpen(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex-1 justify-between"
            data-testid="button-select-client"
          >
            {selectedClient ? selectedClient.name : "Select client..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search clients..." />
            <CommandList>
              <CommandEmpty>No client found.</CommandEmpty>
              <CommandGroup>
                {clients.map((client) => (
                  <CommandItem
                    key={client.id}
                    value={client.name}
                    onSelect={() => {
                      onSelect(client.id);
                      setOpen(false);
                    }}
                    data-testid={`option-client-${client.id}`}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === client.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {client.email}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" data-testid="button-add-client">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Create a new client to add to your invoices.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                placeholder="Acme Corporation"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
                data-testid="input-client-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@acme.com"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
                data-testid="input-client-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="123 Main St, City, State 12345"
                value={newClient.address}
                onChange={(e) =>
                  setNewClient({ ...newClient, address: e.target.value })
                }
                data-testid="input-client-address"
              />
            </div>
            <Button onClick={handleAddClient} className="w-full" data-testid="button-save-client">
              Add Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
