export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      {/* Image */}
      <div className="aspect-square bg-gray-200" />
      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-5 w-12 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 bg-gray-200 rounded-lg w-full" />
        <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-200 rounded-lg w-1/3" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 w-20 bg-gray-200 rounded-lg" />
          <div className="h-9 w-9 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
