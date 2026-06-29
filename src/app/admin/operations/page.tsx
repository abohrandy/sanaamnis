"use client";

import React, { useState } from "react";
import { Tabs } from "@/components/ds/tabs";
import { Table } from "@/components/ds/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, Trash2 } from "lucide-react";

// --- MOCK DATA ---
const CUSTOMERS_DATA = [
  { id: "1", name: "John Doe", email: "john@example.com", orders: 4, spent: "₦418,000" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", orders: 2, spent: "₦190,000" },
  { id: "3", name: "Tunde Alao", email: "tunde@example.com", orders: 1, spent: "₦82,000" },
];

const SUBSCRIBERS_DATA = [
  { id: "1", email: "newsletter1@gmail.com", joined: "June 25, 2026", status: "subscribed" },
  { id: "2", email: "buyer_interest@yahoo.com", joined: "May 12, 2026", status: "subscribed" },
];

export default function AdminOperationsPage() {
  const [customers, setCustomers] = useState(CUSTOMERS_DATA);
  const [subscribers, setSubscribers] = useState(SUBSCRIBERS_DATA);

  // Customers Columns
  const customersColumns = [
    { header: "Customer Name", accessor: "name" as const },
    { header: "Email Address", accessor: "email" as const },
    { header: "Total Orders", accessor: "orders" as const },
    { header: "Total Capital Spent", accessor: "spent" as const },
    {
      header: "Actions",
      accessor: (item: typeof CUSTOMERS_DATA[0]) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCustomers(customers.filter((c) => c.id !== item.id))}
            className="p-1 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  // Subscribers Columns
  const subscribersColumns = [
    { header: "Subscriber Email", accessor: "email" as const },
    { header: "Date Subscribed", accessor: "joined" as const },
    {
      header: "Status",
      accessor: (item: typeof SUBSCRIBERS_DATA[0]) => (
        <Badge variant="success">
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (item: typeof SUBSCRIBERS_DATA[0]) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSubscribers(subscribers.filter((s) => s.id !== item.id))}
            className="p-1 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const tabContents = [
    {
      id: "customers",
      label: "Customer Base Directory",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">Registered Customers</h3>
            <Button size="sm" className="flex items-center gap-1.5 rounded-none">
              Export Client CSV
            </Button>
          </div>
          <Table columns={customersColumns} data={customers} />
        </div>
      ),
    },
    {
      id: "newsletter",
      label: "Newsletter Subscribers",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">Marketing Mail Lists</h3>
            <Button size="sm" className="flex items-center gap-1.5 rounded-none">
              <Mail className="w-3.5 h-3.5" /> Blast Campaign
            </Button>
          </div>
          <Table columns={subscribersColumns} data={subscribers} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white mb-2">
          Operations Center
        </h1>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-sans">
          Manage Customer Portfolios and Newsletter Subscriber Lists
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabContents} />
    </div>
  );
}
