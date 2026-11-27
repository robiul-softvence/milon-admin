import { Icon } from '@/components/ui/Icon'
import { Pill } from '@/components/ui/Pill'
import { Cell, TableHeader, TableRow, TableScroll } from '@/components/ui/Table'
import { CATEGORY_META, TAG_META, dishNames, formatEur } from '../constants'
import type { ContentLanguage, Recipe } from '../types'

interface RecipeTableProps {
  recipes: Recipe[]
  language: ContentLanguage
  onEdit: (recipe: Recipe) => void
  onDelete: (recipe: Recipe) => void
}

/** Figma "Table" inside "Recipe Database" (12px column gap). */
export function RecipeTable({ recipes, language, onEdit, onDelete }: RecipeTableProps) {
  return (
    <TableScroll minWidth={1000}>
      <TableHeader className="gap-3">
        <Cell className="min-w-0 flex-1">Dish</Cell>
        <Cell className="w-[120px]">Category</Cell>
        <Cell className="w-[190px]">Calories &amp; Macros (P / C / F)</Cell>
        <Cell className="w-[80px]">Est. Cost</Cell>
        <Cell className="w-[220px]">Dietary Tags</Cell>
        <Cell className="w-[76px]" aria-label="Actions" />
      </TableHeader>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center gap-1 border-b border-line px-4 py-12 text-center">
          <p className="text-body font-bold text-ink">No recipes match these filters</p>
          <p className="text-caption text-muted">Try a different search, category, tag or cost.</p>
        </div>
      ) : (
        recipes.map((r) => (
          <RecipeRow
            key={r.id}
            recipe={r}
            language={language}
            onEdit={() => onEdit(r)}
            onDelete={() => onDelete(r)}
          />
        ))
      )}
    </TableScroll>
  )
}

interface RecipeRowProps {
  recipe: Recipe
  language: ContentLanguage
  onEdit: () => void
  onDelete: () => void
}

function RecipeRow({ recipe, language, onEdit, onDelete }: RecipeRowProps) {
  const names = dishNames(recipe, language)
  const category = CATEGORY_META[recipe.category]
  return (
    <TableRow className="gap-3">
      <Cell className="min-w-0 flex-1 gap-3">
        {recipe.photo ? (
          <img
            src={recipe.photo}
            alt=""
            className="size-[52px] shrink-0 rounded-xl object-cover"
            loading="lazy"
          />
        ) : (
          <span className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-pearl text-subtle">
            <Icon name="food" size={22} />
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body font-bold text-ink">{names.primary}</p>
          <p
            className={
              names.missing
                ? 'text-caption font-medium text-warning'
                : 'text-caption font-medium text-subtle'
            }
          >
            {names.secondary}
          </p>
        </div>
      </Cell>

      <Cell className="w-[120px]">
        <Pill tone={category.tone} dot>
          {category.label}
        </Pill>
      </Cell>

      <Cell className="w-[190px]">
        <div className="flex flex-col gap-1 whitespace-nowrap">
          <p className="text-body font-bold text-ink">{recipe.kcal} kcal</p>
          <div className="flex items-center gap-2 text-caption font-semibold">
            <span className="text-cta">P {recipe.protein}g</span>
            <span className="text-info">C {recipe.carbs}g</span>
            <span className="text-warning">F {recipe.fat}g</span>
          </div>
        </div>
      </Cell>

      <Cell className="w-[80px]">
        <p className="text-body font-semibold text-success">{formatEur(recipe.cost)}</p>
      </Cell>

      <Cell className="w-[220px]">
        <div className="flex w-[220px] flex-wrap items-center gap-1.5">
          {recipe.tags.map((t) => (
            <Pill key={t} tone={TAG_META[t].tone}>
              {TAG_META[t].label}
            </Pill>
          ))}
        </div>
      </Cell>

      <Cell className="w-[76px] gap-1.5">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${names.primary}`}
          title="Edit"
          className="flex size-8 items-center justify-center rounded-lg bg-pearl text-ink transition-colors hover:bg-line"
        >
          <Icon name="edit" size={16} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${names.primary}`}
          title="Delete"
          className="flex size-8 items-center justify-center rounded-lg bg-peach text-cta transition-colors hover:bg-[#ffd8cc]"
        >
          <Icon name="food-trash" size={16} />
        </button>
      </Cell>
    </TableRow>
  )
}
