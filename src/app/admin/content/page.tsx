"use client";

import React, { useState } from "react";
import { Tabs } from "@/components/ds/tabs";
import { Table } from "@/components/ds/table";
import { Accordion } from "@/components/ds/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, X } from "lucide-react";

// --- INITIAL MOCK DATA ---
const PAGES_DATA = [
  { id: "1", title: "Homepage Layout", slug: "home", status: "published", blocks: "3 sections" },
  { id: "2", title: "About Our Heritage", slug: "about", status: "published", blocks: "2 sections" },
  { id: "3", title: "Sustainability Charter", slug: "ethics", status: "draft", blocks: "1 section" },
];

const BLOG_DATA = [
  { id: "1", title: "Art of Slow Tailoring", author: "Amnis Curator", date: "June 24, 2026", status: "published" },
  { id: "2", title: "Summer Palette Selection", author: "Chika Chuku", date: "May 18, 2026", status: "published" },
];

const INITIAL_FAQS = [
  { id: "faq-1", title: "What is the source of your Cashmere?", content: "Our Cashmere is responsibly sourced from sustainable pasture herds in Outer Mongolia. Every step of production is audited to ensure zero soil erosion or sheep distress." },
  { id: "faq-2", title: "What is your standard delivery timeline?", content: "We dispatch orders within 48 hours. Domestic courier deliveries in Lagos take 1-3 business days, while nationwide distributions require 3-5 business days." },
];

export default function AdminContentPage() {
  const [pages, setPages] = useState(PAGES_DATA);
  const [blogs, setBlogs] = useState(BLOG_DATA);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);

  // Forms Toggle State
  const [activeForm, setActiveForm] = useState<"page" | "blog" | "faq" | null>(null);

  // Form Inputs State
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageBlocks, setPageBlocks] = useState("1 section");
  
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  
  const [faqTitle, setFaqTitle] = useState("");
  const [faqContent, setFaqContent] = useState("");

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    const newPage = {
      id: `${pages.length + 1}`,
      title: pageTitle,
      slug: pageSlug,
      status: "draft",
      blocks: pageBlocks,
    };
    setPages([...pages, newPage]);
    setPageTitle("");
    setPageSlug("");
    setActiveForm(null);
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      id: `${blogs.length + 1}`,
      title: blogTitle,
      author: blogAuthor || "Amnis Curator",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status: "published",
    };
    setBlogs([...blogs, newPost]);
    setBlogTitle("");
    setBlogAuthor("");
    setActiveForm(null);
  };

  const handleCreateFaq = (e: React.FormEvent) => {
    e.preventDefault();
    const newFaq = {
      id: `faq-${faqs.length + 1}`,
      title: faqTitle,
      content: faqContent,
    };
    setFaqs([...faqs, newFaq]);
    setFaqTitle("");
    setFaqContent("");
    setActiveForm(null);
  };

  // Pages columns
  const pagesColumns = [
    { header: "Page Title", accessor: "title" as const },
    { header: "Slug URL Path", accessor: "slug" as const },
    { header: "Component Blocks", accessor: "blocks" as const },
    {
      header: "Status",
      accessor: (item: typeof PAGES_DATA[0]) => (
        <Badge variant={item.status === "published" ? "success" : "secondary"}>
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (item: typeof PAGES_DATA[0]) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPages(pages.filter((p) => p.id !== item.id))}
            className="p-1 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  // Blog columns
  const blogColumns = [
    { header: "Post Title", accessor: "title" as const },
    { header: "Author", accessor: "author" as const },
    { header: "Date Published", accessor: "date" as const },
    {
      header: "Status",
      accessor: (item: typeof BLOG_DATA[0]) => (
        <Badge variant={item.status === "published" ? "success" : "secondary"}>
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (item: typeof BLOG_DATA[0]) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBlogs(blogs.filter((b) => b.id !== item.id))}
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
      id: "pages",
      label: "Custom Pages & Layout Blocks",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">CMS Website Pages</h3>
            <Button
              size="sm"
              onClick={() => setActiveForm("page")}
              className="flex items-center gap-1.5 rounded-none"
            >
              <Plus className="w-3.5 h-3.5" /> Create Page
            </Button>
          </div>
          <Table columns={pagesColumns} data={pages} />
        </div>
      ),
    },
    {
      id: "blog",
      label: "Amnis Journal Articles",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">Journal Posts</h3>
            <Button
              size="sm"
              onClick={() => setActiveForm("blog")}
              className="flex items-center gap-1.5 rounded-none"
            >
              <Plus className="w-3.5 h-3.5" /> New Article
            </Button>
          </div>
          <Table columns={blogColumns} data={blogs} />
        </div>
      ),
    },
    {
      id: "faqs",
      label: "Client Services FAQs",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">Frequently Asked Questions</h3>
            <Button
              size="sm"
              onClick={() => setActiveForm("faq")}
              className="flex items-center gap-1.5 rounded-none"
            >
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </Button>
          </div>
          <Accordion items={faqs} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10 relative">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white mb-2">
          Headless CMS Suite
        </h1>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-sans">
          Compose Editorial Articles, Page Blocks layouts, and dynamic FAQ menus
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabContents} />

      {/* Dialog Modals overlay */}
      {activeForm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center px-4 z-50">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setActiveForm(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {activeForm === "page" && (
              <form onSubmit={handleCreatePage} className="space-y-4">
                <h3 className="font-serif text-lg text-white">Create Layout Page</h3>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Page Title</label>
                  <input
                    type="text"
                    required
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="e.g. Sustainability Charter"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Slug URL Path</label>
                  <input
                    type="text"
                    required
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                    placeholder="e.g. ethics"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Default Sections</label>
                  <select
                    value={pageBlocks}
                    onChange={(e) => setPageBlocks(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  >
                    <option value="1 section">1 Editorial block</option>
                    <option value="2 sections">2 Custom layouts</option>
                    <option value="3 sections">3 Full banners grids</option>
                  </select>
                </div>
                <Button type="submit" className="w-full rounded-none mt-2">
                  Add to CMS Layouts
                </Button>
              </form>
            )}

            {activeForm === "blog" && (
              <form onSubmit={handleCreateBlog} className="space-y-4">
                <h3 className="font-serif text-lg text-white">Compose Journal Article</h3>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g. Crafting Premium Cashmere"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Editorial Author</label>
                  <input
                    type="text"
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    placeholder="e.g. Amnis Curator"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  />
                </div>
                <Button type="submit" className="w-full rounded-none mt-2">
                  Publish to Journal
                </Button>
              </form>
            )}

            {activeForm === "faq" && (
              <form onSubmit={handleCreateFaq} className="space-y-4">
                <h3 className="font-serif text-lg text-white">Add FAQ Document</h3>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">FAQ Question</label>
                  <input
                    type="text"
                    required
                    value={faqTitle}
                    onChange={(e) => setFaqTitle(e.target.value)}
                    placeholder="e.g. Do you ship internationally?"
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">FAQ Content Answer</label>
                  <textarea
                    required
                    rows={4}
                    value={faqContent}
                    onChange={(e) => setFaqContent(e.target.value)}
                    placeholder="Provide detailed answer here..."
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white rounded-none outline-none focus:border-primary resize-none"
                  />
                </div>
                <Button type="submit" className="w-full rounded-none mt-2">
                  Add to FAQs List
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
