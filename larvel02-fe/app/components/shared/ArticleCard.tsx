// @ts-nocheck
import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "~/lib/utils"

export interface ArticleCardProps {
  title: string
  excerpt: string
  imageUrl: string
  category: string
  author: string
  date: string
  slug: string
  className?: string
}

export function ArticleCard({
  title,
  excerpt,
  imageUrl,
  category,
  author,
  date,
  slug,
  className,
}: ArticleCardProps) {
  return (
    <Link
      to={`/article/${slug}`}
      className={cn(
        "group bg-white border border-slate-200 rounded-xl shadow transition-all duration-200 overflow-hidden block hover:shadow-lg hover:-translate-y-2 hover:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
        className
      )}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
          {category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 mb-2 font-display group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-3 mb-4">
          {excerpt}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <span>{author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  )
}
