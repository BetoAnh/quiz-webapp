import { useState, useMemo, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";
import QuizCard from "./QuizCard";

function QuizSkeleton() {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-4 animate-pulse">
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            <div className="flex justify-between mt-4">
                <div className="h-3 w-10 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}

export default function QuizList({ quizzes, loading = false }) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [page, setPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(6);
    const observerRef = useRef(null);
    const pageSize = 6;

    // 👉 Sinh categories từ quizzes
    const categories = useMemo(() => {
        const map = new Map();
        quizzes.forEach((q) => {
            if (q.category_id) {
                map.set(q.category_id, q.category.name || `Category ${q.category_id}`);
            }
        });
        return Array.from(map, ([id, name]) => ({ id, name }));
    }, [quizzes]);

    // Lọc dữ liệu
    const filtered = useMemo(() => {
        return quizzes
            .filter((q) =>
                search
                    ? q.title.toLowerCase().includes(search.toLowerCase()) ||
                    q.description.toLowerCase().includes(search.toLowerCase())
                    : true
            )
            .filter((q) => (selectedCategory ? q.category_id === selectedCategory : true));
    }, [quizzes, search, selectedCategory]);

    const totalPage = Math.ceil(filtered.length / pageSize);

    // Desktop: phân trang
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    // Mobile: infinite scroll
    const infiniteData = filtered.slice(0, visibleCount);

    // Infinite scroll observer
    useEffect(() => {
        if (!observerRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + pageSize, filtered.length));
                }
            },
            { threshold: 1 }
        );
        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [filtered]);

    return (
        <div className="w-full space-y-4">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-end gap-2">
                {/* Search */}
                <div className="relative w-full sm:w-1/3">
                    <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search quiz..."
                        className="pl-8 pr-3 py-2 w-full border rounded-xl focus:ring-2 focus:ring-indigo-500"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                            setVisibleCount(pageSize);
                        }}
                    />
                </div>

                {/* Category filter */}
                {categories.length > 0 && (
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="px-4 py-2 border rounded-xl bg-white shadow-sm hover:bg-gray-50">
                            {selectedCategory
                                ? categories.find((c) => c.id === selectedCategory)?.name
                                : "All Categories"}
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`block w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-100" : ""
                                                }`}
                                            onClick={() => {
                                                setSelectedCategory(null);
                                                setPage(1);
                                                setVisibleCount(pageSize);
                                            }}
                                        >
                                            All Categories
                                        </button>
                                    )}
                                </Menu.Item>
                                {categories.map((c) => (
                                    <Menu.Item key={c.id}>
                                        {({ active }) => (
                                            <button
                                                className={`block w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-100" : ""
                                                    }`}
                                                onClick={() => {
                                                    setSelectedCategory(c.id);
                                                    setPage(1);
                                                    setVisibleCount(pageSize);
                                                }}
                                            >
                                                {c.name}
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Menu>
                )}
            </div>

            {/* Quiz Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Mobile → infinite scroll */}
                <div className="block md:hidden col-span-full w-full">
                    <div className="grid gap-4">
                        {loading
                            ? [...Array(6)].map((_, i) => <QuizSkeleton key={i} />)
                            : infiniteData.length > 0
                                ? infiniteData.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
                                : <p className="text-center text-gray-500">No quiz found</p>}
                        {!loading && infiniteData.length < filtered.length && (
                            <div ref={observerRef} className="h-8"></div>
                        )}
                    </div>
                </div>

                {/* Desktop → pagination */}
                <div className="hidden md:grid md:grid-cols-2 gap-4 col-span-full">
                    {loading
                        ? [...Array(6)].map((_, i) => <QuizSkeleton key={i} />)
                        : paginated.length > 0
                            ? paginated.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
                            : <p className="col-span-full text-center text-gray-500">No quiz found</p>}
                </div>
            </div>

            {/* Pagination (desktop only) */}
            {!loading && totalPage > 1 && (
                <div className="hidden md:flex justify-center gap-2 mt-4">
                    <button
                        className="px-3 py-1 rounded-lg border bg-white shadow-sm disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Prev
                    </button>
                    {[...Array(totalPage)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded-lg border ${page === i + 1 ? "bg-indigo-500 text-white" : "bg-white hover:bg-gray-50"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="px-3 py-1 rounded-lg border bg-white shadow-sm disabled:opacity-50"
                        disabled={page === totalPage}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
