'use client';
// TODO Step 2.5: collapsible hierarchy, sync with URL category= parameter
interface Category {
  value: string;
  count: number;
}

interface CategoryTreeProps {
  categories: Category[];
}

export function CategoryTree({ categories }: CategoryTreeProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Category</h3>
      <ul className="flex flex-col gap-1">
        {categories.map((c) => (
          <li key={c.value}>
            <button className="text-sm text-left w-full hover:text-blue-600 py-0.5">
              {c.value}
              <span className="text-gray-400 ml-1">({c.count})</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
