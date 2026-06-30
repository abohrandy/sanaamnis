"use client";

import React, { useState } from "react";
import { Tabs } from "@/components/ds/tabs";
import { Table } from "@/components/ds/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Trash2, ShieldCheck, Download, Award, TrendingUp, ShoppingCart } from "lucide-react";

// --- CLIENT PORTFOLIOS & TRANSACTION HISTORY ---
const CUSTOMERS_DATA = [
  { id: "1", name: "Adebayo O.", email: "adebayo@gmail.com", orders: 12, spent: "₦360,000", preference: "500ml Coconut Water Bottles" },
  { id: "2", name: "Chioma K.", email: "chioma.k@yahoo.com", orders: 8, spent: "₦240,000", preference: "500ml Coconut Water Bottles" },
  { id: "3", name: "Hassana Jibril", email: "hassana.j@outlook.com", orders: 4, spent: "₦60,000", preference: "250ml Coconut Water Pouches" },
  { id: "4", name: "Amina Kaduna", email: "amina.k@gmail.com", orders: 6, spent: "₦90,000", preference: "250ml Coconut Water Pouches" },
];

const TRANSACTIONS_DATA = [
  { id: "TX-9021", client: "Adebayo O.", reference: "pstk_902816", amount: "₦30,000", date: "June 30, 2026", method: "Paystack Card", status: "success" },
  { id: "TX-9018", client: "Chioma K.", reference: "pstk_901538", amount: "₦30,000", date: "June 29, 2026", method: "Paystack Transfer", status: "success" },
  { id: "TX-8994", client: "Amina Kaduna", reference: "pstk_899214", amount: "₦15,000", date: "June 28, 2026", method: "Paystack Card", status: "success" },
  { id: "TX-8912", client: "Hassana Jibril", reference: "pstk_890281", amount: "₦15,000", date: "June 24, 2026", method: "Paystack Transfer", status: "success" },
];

const SUBSCRIBERS_DATA = [
  { id: "1", email: "newsletter1@gmail.com", joined: "June 25, 2026", status: "subscribed" },
  { id: "2", email: "buyer_interest@yahoo.com", joined: "May 12, 2026", status: "subscribed" },
];

export default function AdminOperationsPage() {
  const [customers, setCustomers] = useState(CUSTOMERS_DATA);
  const [transactions, setTransactions] = useState(TRANSACTIONS_DATA);
  const [subscribers, setSubscribers] = useState(SUBSCRIBERS_DATA);

  // Customers Columns
  const customersColumns = [
    { header: "Customer Name", accessor: "name" as const },
    { header: "Email Address", accessor: "email" as const },
    { header: "Total Orders", accessor: "orders" as const },
    { header: "Total Capital Spent", accessor: "spent" as const },
    { header: "Preferred Formulation", accessor: "preference" as const },
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

  // Transactions Columns
  const transactionsColumns = [
    { header: "Tx ID", accessor: "id" as const },
    { header: "Client", accessor: "client" as const },
    { header: "Paystack Ref", accessor: "reference" as const },
    { header: "Paid Amount", accessor: "amount" as const },
    { header: "Payment Method", accessor: "method" as const },
    { header: "Transaction Date", accessor: "date" as const },
    {
      header: "Status",
      accessor: (item: typeof TRANSACTIONS_DATA[0]) => (
        <Badge variant="success">
          {item.status}
        </Badge>
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
      label: "Client Database & Habits",
      content: (
        <div className="space-y-8">
          {/* Quick Analytics Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-2">
              <div className="flex justify-between items-center text-neutral-400">
                <span className="text-[10px] uppercase tracking-widest font-bold">Top Premium Spender</span>
                <Award className="w-4 h-4 text-[#cea62c]" />
              </div>
              <h4 className="font-serif text-lg text-white">Adebayo O.</h4>
              <p className="text-xs text-neutral-500">Total Spent: ₦360,000 (12 Orders)</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-2">
              <div className="flex justify-between items-center text-neutral-400">
                <span className="text-[10px] uppercase tracking-widest font-bold">Preferred Item</span>
                <ShoppingCart className="w-4 h-4 text-primary" />
              </div>
              <h4 className="font-serif text-lg text-white">500ml Bottle Pack</h4>
              <p className="text-xs text-neutral-500">Represents 70% of total catalog revenue</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-2">
              <div className="flex justify-between items-center text-neutral-400">
                <span className="text-[10px] uppercase tracking-widest font-bold">AOV (Avg Order Value)</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <h4 className="font-serif text-lg text-white">₦22,500</h4>
              <p className="text-xs text-neutral-500">Up 15% from last marketing cycle</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">Client Habit Profiler</h3>
              <Button size="sm" className="flex items-center gap-1.5 rounded-none">
                <Download className="w-3.5 h-3.5" /> Export Client Database
              </Button>
            </div>
            <Table columns={customersColumns} data={customers} />
          </div>
        </div>
      ),
    },
    {
      id: "transactions",
      label: "Transaction History",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">Payment Audit Log</h3>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Paystack Secured
            </span>
          </div>
          <Table columns={transactionsColumns} data={transactions} />
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
          Manage Customer Portfolios, Spending Habits, and Transaction Records
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabContents} />
    </div>
  );
}
