"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Package, BookOpen, Search, ShoppingCart } from "lucide-react";

const BookMarketplace = () => {
    const [books] = useState([
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            condition: "Good",
            price: 8.99,
            seller: "bookworm123",
            description: "Minor wear on corners, no markings inside",
            isBundle: false,
        },
        {
            id: 2,
            title: "Classic Literature Bundle",
            author: "Various Authors",
            condition: "Very Good",
            price: 24.99,
            seller: "librarykeeper",
            description: "Bundle of 4 classic novels",
            isBundle: true,
            bundleItems: [
                "Pride and Prejudice",
                "Jane Eyre",
                "Wuthering Heights",
                "Little Women",
            ],
        },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "single" | "bundles">("all");

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filter === "all" ||
            (filter === "bundles" && book.isBundle) ||
            (filter === "single" && !book.isBundle);
        return matchesSearch && matchesFilter;
    });

    const handlePurchase = async (book: any) => {
        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ book }),
        });

        const data = await res.json();
        if (data.sessionUrl) {
            window.location.href = data.sessionUrl;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Lynn's Used Book Marketplace</h1>

            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <Input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
                        All
                    </Button>
                    <Button variant={filter === "single" ? "default" : "outline"} onClick={() => setFilter("single")}>
                        <BookOpen className="mr-2" size={18} /> Single
                    </Button>
                    <Button variant={filter === "bundles" ? "default" : "outline"} onClick={() => setFilter("bundles")}>
                        <Package className="mr-2" size={18} /> Bundles
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                    <Card key={book.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold">{book.title}</h3>
                                    <p className="text-gray-600">{book.author}</p>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger>
                                        {book.isBundle ? (
                                            <Package className="text-blue-500" size={22} />
                                        ) : (
                                            <BookOpen className="text-green-500" size={22} />
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {book.isBundle ? "This is a bundle" : "This is a single book"}
                                    </TooltipContent>
                                </Tooltip>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                            <div className="mb-4">
                                <p className="text-gray-700">{book.description}</p>
                                {book.isBundle && (
                                    <ul className="mt-2 space-y-1">
                                        {book.bundleItems?.map((item, index) => (
                                            <li key={index} className="text-sm text-gray-600">
                                                • {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="mt-auto space-y-2">
                                <div className="text-sm text-gray-600 flex justify-between">
                                    <span>Condition: {book.condition}</span>
                                    <span>Seller: {book.seller}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xl font-bold">${book.price}</p>
                                    <Button onClick={() => handlePurchase(book)}>
                                        <ShoppingCart className="mr-2" size={18} /> Buy
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BookMarketplace;
