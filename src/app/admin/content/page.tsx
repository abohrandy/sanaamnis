"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs } from "@/components/ds/tabs";
import { Table } from "@/components/ds/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { Edit, Plus, Trash2, X } from "lucide-react";

interface AdminPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  imageUrl: string | null;
  isPublished: boolean;
}

interface AdminRecipe {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  difficulty: string;
  durationLabel: string;
  servingsLabel: string;
  ingredients: string[];
  instructions: string | null;
  tip: string | null;
  usesProductSlugs: string[];
  isPublished: boolean;
}

interface AdminFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data as T;
}

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function AdminContentPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const invalidate = (key: string) => queryClient.invalidateQueries({ queryKey: ["admin", key] });

  // ------------------------------------------------------------------- Blog
  const postsQuery = useQuery({ queryKey: ["admin", "blog"], queryFn: () => api<{ posts: AdminPost[] }>("/api/admin/blog") });
  const posts = postsQuery.data?.posts ?? [];

  const [postModal, setPostModal] = useState<"add" | "edit" | null>(null);
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postCategory, setPostCategory] = useState("Guides");
  const [postImage, setPostImage] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postPublished, setPostPublished] = useState(true);

  const resetPostForm = () => {
    setPostTitle("");
    setPostSlug("");
    setPostExcerpt("");
    setPostCategory("Guides");
    setPostImage("");
    setPostContent("");
    setPostPublished(true);
  };

  const savePost = useMutation({
    mutationFn: () => {
      const body = {
        title: postTitle,
        excerpt: postExcerpt || undefined,
        content: postContent,
        category: postCategory,
        imageUrl: postImage || undefined,
        isPublished: postPublished,
      };
      return editingPost
        ? api(`/api/admin/blog/${editingPost.id}`, { method: "PATCH", body: JSON.stringify(body) })
        : api("/api/admin/blog", { method: "POST", body: JSON.stringify({ ...body, slug: postSlug || slugify(postTitle) }) });
    },
    onSuccess: () => {
      toast.success(editingPost ? "Article updated" : "Article published");
      invalidate("blog");
      setPostModal(null);
    },
    onError: (err: Error) => toast.error("Could not save article", err.message),
  });

  const deletePost = useMutation({
    mutationFn: (id: string) => api(`/api/admin/blog/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Article deleted");
      invalidate("blog");
    },
    onError: (err: Error) => toast.error("Could not delete article", err.message),
  });

  const openEditPost = (post: AdminPost) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostExcerpt(post.excerpt ?? "");
    setPostCategory(post.category);
    setPostImage(post.imageUrl ?? "");
    setPostContent(post.content ?? "");
    setPostPublished(post.isPublished);
    setPostModal("edit");
  };

  // ---------------------------------------------------------------- Recipes
  const recipesQuery = useQuery({ queryKey: ["admin", "recipes"], queryFn: () => api<{ recipes: AdminRecipe[] }>("/api/admin/recipes") });
  const recipeList = recipesQuery.data?.recipes ?? [];

  const [recipeModal, setRecipeModal] = useState<"add" | "edit" | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<AdminRecipe | null>(null);
  const [rTitle, setRTitle] = useState("");
  const [rSlug, setRSlug] = useState("");
  const [rExcerpt, setRExcerpt] = useState("");
  const [rImage, setRImage] = useState("");
  const [rDifficulty, setRDifficulty] = useState<"Easy" | "Simple" | "Takes practice">("Easy");
  const [rDuration, setRDuration] = useState("30 mins");
  const [rServings, setRServings] = useState("Serves 4");
  const [rIngredients, setRIngredients] = useState("");
  const [rSteps, setRSteps] = useState("");
  const [rTip, setRTip] = useState("");
  const [rUses, setRUses] = useState("");

  const resetRecipeForm = () => {
    setRTitle("");
    setRSlug("");
    setRExcerpt("");
    setRImage("");
    setRDifficulty("Easy");
    setRDuration("30 mins");
    setRServings("Serves 4");
    setRIngredients("");
    setRSteps("");
    setRTip("");
    setRUses("");
  };

  const saveRecipe = useMutation({
    mutationFn: () => {
      const body = {
        title: rTitle,
        excerpt: rExcerpt || undefined,
        imageUrl: rImage || undefined,
        difficulty: rDifficulty,
        durationLabel: rDuration,
        servingsLabel: rServings,
        ingredients: rIngredients.split("\n").map((s) => s.trim()).filter(Boolean),
        steps: rSteps.split("\n").map((s) => s.trim()).filter(Boolean),
        tip: rTip || undefined,
        usesProductSlugs: rUses.split(",").map((s) => s.trim()).filter(Boolean),
      };
      return editingRecipe
        ? api(`/api/admin/recipes/${editingRecipe.id}`, { method: "PATCH", body: JSON.stringify(body) })
        : api("/api/admin/recipes", { method: "POST", body: JSON.stringify({ ...body, slug: rSlug || slugify(rTitle) }) });
    },
    onSuccess: () => {
      toast.success(editingRecipe ? "Recipe updated" : "Recipe published");
      invalidate("recipes");
      setRecipeModal(null);
    },
    onError: (err: Error) => toast.error("Could not save recipe", err.message),
  });

  const deleteRecipe = useMutation({
    mutationFn: (id: string) => api(`/api/admin/recipes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Recipe deleted");
      invalidate("recipes");
    },
    onError: (err: Error) => toast.error("Could not delete recipe", err.message),
  });

  const openEditRecipe = (recipe: AdminRecipe) => {
    setEditingRecipe(recipe);
    setRTitle(recipe.title);
    setRExcerpt(recipe.excerpt ?? "");
    setRImage(recipe.imageUrl ?? "");
    setRDifficulty((["Easy", "Simple", "Takes practice"] as const).includes(recipe.difficulty as never) ? (recipe.difficulty as "Easy") : "Easy");
    setRDuration(recipe.durationLabel);
    setRServings(recipe.servingsLabel);
    setRIngredients(recipe.ingredients.join("\n"));
    setRSteps((recipe.instructions ?? "").split("\n").join("\n"));
    setRTip(recipe.tip ?? "");
    setRUses(recipe.usesProductSlugs.join(", "));
    setRecipeModal("edit");
  };

  // -------------------------------------------------------------------- FAQ
  const faqsQuery = useQuery({ queryKey: ["admin", "faqs"], queryFn: () => api<{ faqs: AdminFaq[] }>("/api/admin/faqs") });
  const faqList = faqsQuery.data?.faqs ?? [];

  const [faqModal, setFaqModal] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqCategory, setFaqCategory] = useState("general");

  const createFaq = useMutation({
    mutationFn: () => api("/api/admin/faqs", { method: "POST", body: JSON.stringify({ question: faqQuestion, answer: faqAnswer, category: faqCategory }) }),
    onSuccess: () => {
      toast.success("FAQ added");
      invalidate("faqs");
      setFaqModal(false);
      setFaqQuestion("");
      setFaqAnswer("");
      setFaqCategory("general");
    },
    onError: (err: Error) => toast.error("Could not add FAQ", err.message),
  });

  const deleteFaq = useMutation({
    mutationFn: (id: string) => api(`/api/admin/faqs/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("FAQ removed");
      invalidate("faqs");
    },
    onError: (err: Error) => toast.error("Could not remove FAQ", err.message),
  });

  // ------------------------------------------------------------------ Tables
  const postColumns = [
    {
      header: "Title",
      accessor: (item: AdminPost) => (
        <button onClick={() => openEditPost(item)} className="text-left cursor-pointer">
          <span className="font-serif text-sm font-semibold text-white block">{item.title}</span>
          <span className="text-[10px] text-neutral-400">/blog/{item.slug}</span>
        </button>
      ),
    },
    { header: "Category", accessor: "category" as const },
    { header: "Status", accessor: (item: AdminPost) => <Badge variant={item.isPublished ? "success" : "secondary"}>{item.isPublished ? "Published" : "Draft"}</Badge> },
    {
      header: "Actions",
      accessor: (item: AdminPost) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEditPost(item)} className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => confirm(`Delete "${item.title}"?`) && deletePost.mutate(item.id)} className="p-2 text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const recipeColumns = [
    {
      header: "Title",
      accessor: (item: AdminRecipe) => (
        <button onClick={() => openEditRecipe(item)} className="text-left cursor-pointer">
          <span className="font-serif text-sm font-semibold text-white block">{item.title}</span>
          <span className="text-[10px] text-neutral-400">/recipes/{item.slug}</span>
        </button>
      ),
    },
    { header: "Difficulty", accessor: "difficulty" as const },
    { header: "Status", accessor: (item: AdminRecipe) => <Badge variant={item.isPublished ? "success" : "secondary"}>{item.isPublished ? "Published" : "Draft"}</Badge> },
    {
      header: "Actions",
      accessor: (item: AdminRecipe) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEditRecipe(item)} className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => confirm(`Delete "${item.title}"?`) && deleteRecipe.mutate(item.id)} className="p-2 text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const faqColumns = [
    { header: "Question", accessor: "question" as const },
    { header: "Category", accessor: "category" as const },
    {
      header: "Actions",
      accessor: (item: AdminFaq) => (
        <Button variant="ghost" size="sm" onClick={() => confirm("Remove this FAQ?") && deleteFaq.mutate(item.id)} className="p-2 text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const tabContents = [
    {
      id: "blog",
      label: "Journal",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-neutral-900/60 p-4 border border-neutral-800">
            <h3 className="text-xs uppercase tracking-widest text-neutral-300 font-bold font-sans">Articles ({posts.length})</h3>
            <Button
              size="sm"
              onClick={() => {
                setEditingPost(null);
                resetPostForm();
                setPostModal("add");
              }}
              className="flex items-center gap-1.5 rounded-none bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider px-4 py-2"
            >
              <Plus className="w-4 h-4" /> New Article
            </Button>
          </div>
          <Table columns={postColumns} data={posts} loading={postsQuery.isLoading} />
        </div>
      ),
    },
    {
      id: "recipes",
      label: "Recipes",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-neutral-900/60 p-4 border border-neutral-800">
            <h3 className="text-xs uppercase tracking-widest text-neutral-300 font-bold font-sans">Recipes ({recipeList.length})</h3>
            <Button
              size="sm"
              onClick={() => {
                setEditingRecipe(null);
                resetRecipeForm();
                setRecipeModal("add");
              }}
              className="flex items-center gap-1.5 rounded-none bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider px-4 py-2"
            >
              <Plus className="w-4 h-4" /> New Recipe
            </Button>
          </div>
          <Table columns={recipeColumns} data={recipeList} loading={recipesQuery.isLoading} />
        </div>
      ),
    },
    {
      id: "faqs",
      label: "FAQs",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-neutral-900/60 p-4 border border-neutral-800">
            <h3 className="text-xs uppercase tracking-widest text-neutral-300 font-bold font-sans">FAQs ({faqList.length})</h3>
            <Button size="sm" onClick={() => setFaqModal(true)} className="flex items-center gap-1.5 rounded-none bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider px-4 py-2">
              <Plus className="w-4 h-4" /> Add FAQ
            </Button>
          </div>
          <Table columns={faqColumns} data={faqList} loading={faqsQuery.isLoading} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10 relative">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white mb-2">Content</h1>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-sans">
          Journal, recipes and FAQs — changes apply to the live storefront immediately.
        </p>
      </div>

      <Tabs tabs={tabContents} />

      {/* Article Modal */}
      {postModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center px-4 z-50 overflow-y-auto py-10">
          <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 p-8 shadow-2xl space-y-5 relative my-auto">
            <button onClick={() => setPostModal(null)} className="absolute top-5 right-5 text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-semibold text-white border-b border-neutral-800 pb-4">
              {editingPost ? "Edit Article" : "New Article"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                savePost.mutate();
              }}
              className="space-y-4"
            >
              <Input label="Title" required value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
              {!editingPost && <Input label="Slug (optional)" value={postSlug} onChange={(e) => setPostSlug(e.target.value)} placeholder={slugify(postTitle)} />}
              <div className="grid grid-cols-2 gap-4">
                <Input label="Category" required value={postCategory} onChange={(e) => setPostCategory(e.target.value)} />
                <Input label="Image URL" value={postImage} onChange={(e) => setPostImage(e.target.value)} placeholder="/products/… or https://…" />
              </div>
              <Input label="Excerpt" value={postExcerpt} onChange={(e) => setPostExcerpt(e.target.value)} placeholder="One sentence for the listing card" />
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">
                  Content — blank line between paragraphs, start a line with &quot;## &quot; for a heading
                </label>
                <textarea
                  required
                  rows={10}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-primary resize-y font-mono"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-neutral-300">
                <input type="checkbox" checked={postPublished} onChange={(e) => setPostPublished(e.target.checked)} />
                Published (unchecked saves as a draft)
              </label>
              <div className="pt-2 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setPostModal(null)} className="flex-1 rounded-none border-neutral-800 text-neutral-400 hover:text-white">
                  Cancel
                </Button>
                <Button type="submit" loading={savePost.isPending} className="flex-1 rounded-none bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider">
                  {editingPost ? "Save Changes" : "Publish"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      {recipeModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center px-4 z-50 overflow-y-auto py-10">
          <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 p-8 shadow-2xl space-y-5 relative my-auto">
            <button onClick={() => setRecipeModal(null)} className="absolute top-5 right-5 text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-semibold text-white border-b border-neutral-800 pb-4">
              {editingRecipe ? "Edit Recipe" : "New Recipe"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveRecipe.mutate();
              }}
              className="space-y-4"
            >
              <Input label="Title" required value={rTitle} onChange={(e) => setRTitle(e.target.value)} />
              {!editingRecipe && <Input label="Slug (optional)" value={rSlug} onChange={(e) => setRSlug(e.target.value)} placeholder={slugify(rTitle)} />}
              <Input label="Excerpt" value={rExcerpt} onChange={(e) => setRExcerpt(e.target.value)} />
              <Input label="Image URL" value={rImage} onChange={(e) => setRImage(e.target.value)} placeholder="/products/… or https://…" />
              <div className="grid grid-cols-3 gap-4">
                <Select
                  label="Difficulty"
                  value={rDifficulty}
                  onChange={(e) => setRDifficulty(e.target.value as typeof rDifficulty)}
                  options={[
                    { value: "Easy", label: "Easy" },
                    { value: "Simple", label: "Simple" },
                    { value: "Takes practice", label: "Takes practice" },
                  ]}
                />
                <Input label="Duration" required value={rDuration} onChange={(e) => setRDuration(e.target.value)} placeholder="35 mins" />
                <Input label="Servings" required value={rServings} onChange={(e) => setRServings(e.target.value)} placeholder="Serves 4" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">Ingredients — one per line</label>
                <textarea required rows={5} value={rIngredients} onChange={(e) => setRIngredients(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-primary resize-y" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">Steps — one per line</label>
                <textarea required rows={5} value={rSteps} onChange={(e) => setRSteps(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-primary resize-y" />
              </div>
              <Input label="Tip (optional)" value={rTip} onChange={(e) => setRTip(e.target.value)} />
              <Input label="Related product slugs (comma-separated, optional)" value={rUses} onChange={(e) => setRUses(e.target.value)} placeholder="extra-virgin-coconut-oil, sana-amnis-coconut-water" />
              <div className="pt-2 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setRecipeModal(null)} className="flex-1 rounded-none border-neutral-800 text-neutral-400 hover:text-white">
                  Cancel
                </Button>
                <Button type="submit" loading={saveRecipe.isPending} className="flex-1 rounded-none bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider">
                  {editingRecipe ? "Save Changes" : "Publish"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {faqModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center px-4 z-50">
          <div className="max-w-lg w-full bg-neutral-900 border border-neutral-800 p-8 shadow-2xl space-y-4 relative">
            <button onClick={() => setFaqModal(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-lg text-white">Add FAQ</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createFaq.mutate();
              }}
              className="space-y-4"
            >
              <Input label="Question" required value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)} />
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold block">
                  Answer — optionally include one link as [label](/path)
                </label>
                <textarea required rows={4} value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-primary resize-y" />
              </div>
              <Input label="Category" value={faqCategory} onChange={(e) => setFaqCategory(e.target.value)} />
              <Button type="submit" loading={createFaq.isPending} className="w-full rounded-none mt-2">
                Add FAQ
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
