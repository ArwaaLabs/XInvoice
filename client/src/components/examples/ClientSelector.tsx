import { useState } from "react";
import { ClientSelector, type Client } from "../client-selector";

export default function ClientSelectorExample() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Tech Corp",
      email: "contact@techcorp.com",
      address: "456 Business Blvd, New York, NY 10001",
    },
    {
      id: "2",
      name: "Design Agency",
      email: "hello@designagency.com",
      address: "789 Creative Lane, Los Angeles, CA 90001",
    },
  ]);
  const [selected, setSelected] = useState<string>();

  const handleAddClient = (newClient: Omit<Client, "id">) => {
    const client: Client = {
      ...newClient,
      id: Math.random().toString(36).substr(2, 9),
    };
    setClients([...clients, client]);
    setSelected(client.id);
  };

  return (
    <div className="p-6 max-w-md">
      <ClientSelector
        clients={clients}
        value={selected}
        onSelect={setSelected}
        onAddClient={handleAddClient}
      />
    </div>
  );
}
