"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function NewBookForm() {
    const [form, setForm] = useState({
        title: "",
        author: "",
        description: "",
        condition: "",
        price: "",
        seller: "",
        isBundle: false,
        bundleItems: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) : value,
        }));
    };

    const handleCheckbox = (checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            isBundle: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fullPrice = parseFloat(form.price) * 1.05; // Adding 5% fee

        const payload = {
      title: form.title,
      author: form.author,
      description: form.description,
      condition: form.condition,
      seller: form.seller,
      price: fullPrice,
      isBundle: form.isBundle,
      bundleItems: form.isBundle
        ? form.bundleItems.split(",").map((b) => b.trim())
        : [],
    };

    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Book listed!");
      setForm({
        title: "",
        author: "",
        description: "",
        condition: "",
        price: "",
        seller: "",
        isBundle: false,
        bundleItems: "",
      });
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 p-4 border rounded-lg shadow-sm mx-auto mt-10">
      <h2 className="text-xl font-semibold">List a New Book</h2>

      <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <Input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
      <Input name="condition" placeholder="Condition (e.g. Good, Like New)" value={form.condition} onChange={handleChange} required />
      <Input name="price" type="number" step="0.01" placeholder="Price (without fee)" value={form.price} onChange={handleChange} required />
      <Input name="seller" placeholder="Seller Username" value={form.seller} onChange={handleChange} required />
      <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

      <div className="flex items-center gap-2">
        <Checkbox id="bundle" checked={form.isBundle} onCheckedChange={handleCheckbox} />
        <Label htmlFor="bundle">This is a bundle</Label>
      </div>

      {form.isBundle && (
        <Input
          name="bundleItems"
          placeholder="Bundle items (comma separated)"
          value={form.bundleItems}
          onChange={handleChange}
        />
      )}

      <Button type="submit">Submit</Button>
    </form>
  );
}