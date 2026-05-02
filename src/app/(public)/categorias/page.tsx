"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts } from "@/lib/api/products";
import type { Category } from "@/lib/types";

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts()
      ]);
      
      const imagesMap: Record<string, string> = {};
      
      categoriesData.forEach(cat => {
        const categoryProducts = productsData.filter((p) => p.category_id === cat.id && p.image_url);
        if (categoryProducts.length > 0) {
          const randomIndex = Math.floor(Math.random() * categoryProducts.length);
          imagesMap[cat.id] = categoryProducts[randomIndex].image_url!;
        }
      });
      
      setCategoryImages(imagesMap);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link
            href="/"
            prefetch
            className="text-gray-500 hover:text-black transition-colors font-light"
          >
            Início
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-black font-light">Categorias</span>
        </nav>

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-gray-200">
          <h1 className="text-4xl font-light tracking-tight text-black mb-2">
            Categorias
          </h1>
          <p className="text-gray-600 font-light">
            Explore nossas coleções exclusivas de semijoias
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <h3 className="text-2xl font-light text-gray-900 mb-2">
              Nenhuma categoria encontrada
            </h3>
            <p className="text-gray-600 font-light max-w-md mx-auto">
              No momento não há categorias disponíveis para exibição.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => {
              const bgImage = categoryImages[cat.id];
              
              return (
                <Link
                  key={cat.id}
                  href={`/produtos?categoria=${cat.id}`}
                  className="group relative bg-gray-50 rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-500 flex flex-col items-center justify-center text-center h-64"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {bgImage ? (
                    <>
                      <Image 
                        src={bgImage} 
                        alt={cat.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500"></div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </>
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center px-4">
                    <h3 className={`text-2xl font-medium ${bgImage ? 'text-white' : 'text-black'} group-hover:scale-110 transition-transform duration-500`}>
                      {cat.name}
                    </h3>
                    <div className={`mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0`}>
                      <span className={`inline-flex items-center gap-1 text-sm font-light ${bgImage ? 'text-gray-200' : 'text-gray-600'}`}>
                        Ver produtos
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
