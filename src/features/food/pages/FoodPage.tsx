import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IconButton } from '@/components/ui/IconButton'
import { Pill } from '@/components/ui/Pill'
import { SearchField } from '@/components/ui/SearchField'
import {
  CATEGORIES,
  COST_FILTERS,
  DIETARY_TAGS,
  TAG_META,
  dishNames,
  formatEur,
  formatInt,
} from '../constants'
import { Chip } from '../components/Chip'
import { DeleteRecipeDialog } from '../components/DeleteRecipeDialog'
import { FilterMenu } from '../components/FilterMenu'
import { LanguageToggle } from '../components/LanguageToggle'
import { RecipeFormModal } from '../components/RecipeFormModal'
import { RecipeTable } from '../components/RecipeTable'
import { StatCard } from '../components/StatCard'
import { useDeleteRecipe, useFood, useSaveRecipe } from '../hooks/useFood'
import type {
  ContentLanguage,
  CostFilter,
  DietaryTag,
  MealCategory,
  Recipe,
  RecipeInput,
} from '../types'

type TagFilter = DietaryTag | 'any'

const TAG_OPTIONS: { value: TagFilter; label: string }[] = [
  { value: 'any', label: 'All dietary tags' },
  ...DIETARY_TAGS.map((t) => ({ value: t.value, label: t.label })),
]

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

export default function FoodPage() {
  const { data, isLoading, isError } = useFood()
  const saveRecipe = useSaveRecipe()
  const removeRecipe = useDeleteRecipe()

  const [language, setLanguage] = useState<ContentLanguage>('en')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<MealCategory | 'all'>('all')
  const [tag, setTag] = useState<TagFilter>('any')
  const [cost, setCost] = useState<CostFilter>('any')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Recipe | null>(null)
  const [deleting, setDeleting] = useState<Recipe | null>(null)

  const recipes = useMemo(() => {
    if (!data) return []
    const q = normalize(query.trim())
    const costMatch = COST_FILTERS.find((c) => c.value === cost)!.match
    return data.recipes.filter(
      (r) =>
        (category === 'all' || r.category === category) &&
        (tag === 'any' || r.tags.includes(tag)) &&
        costMatch(r.cost) &&
        (!q || normalize(`${r.name.en} ${r.name.fr ?? ''}`).includes(q)),
    )
  }, [data, query, category, tag, cost])

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (r: Recipe) => {
    setEditing(r)
    setFormOpen(true)
  }
  const closeForm = () => setFormOpen(false)

  const submitForm = (input: RecipeInput) =>
    saveRecipe.mutate({ id: editing?.id, input }, { onSuccess: closeForm })

  const confirmDelete = () => {
    if (!deleting) return
    removeRecipe.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
  }

  const stats = data?.stats
  const missingFr = stats ? stats.recipes - stats.translatedFr : 0
  const translatedPct =
    stats && stats.recipes ? Math.round((stats.translatedFr / stats.recipes) * 100) : 0
  const costLabel = COST_FILTERS.find((c) => c.value === cost)!.label

  return (
    <>
      <PageHeader
        title="Food & Recipe Database"
        subtitle="Bilingual nutrition content powering every MILON meal plan."
        actions={
          <>
            <IconButton icon="bell" label="Notifications" />
            <LanguageToggle value={language} onChange={setLanguage} />
            <Button variant="primary" icon="plus" onClick={openAdd}>
              Add New Recipe / Food
            </Button>
          </>
        }
      />

      {isError && <p className="text-body text-cta">Couldn't load recipes. Please try again.</p>}

      {isLoading || !data || !stats ? (
        <FoodSkeleton />
      ) : (
        <>
          <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:flex xl:items-center">
            <StatCard label="Recipes" value={formatInt(stats.recipes)} dotClassName="bg-info" />
            <StatCard
              label="Food items"
              value={formatInt(stats.foodItems)}
              dotClassName="bg-success"
            />
            <StatCard
              label="Avg. cost / meal"
              value={formatEur(stats.avgCostPerMeal)}
              dotClassName="bg-coral"
            />
            <StatCard
              label="Pending review"
              value={formatInt(stats.pendingReview)}
              dotClassName="bg-warning"
            />
          </section>

          <Card className="flex w-full flex-col gap-5 p-4 sm:p-6">
            <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:gap-2.5">
              <SearchField
                placeholder={`Search ${formatInt(stats.recipes)} recipes & foods`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                containerClassName="w-full shrink-0 xl:w-[300px]"
                aria-label="Search recipes and foods"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 xl:contents">
                <div className="-mx-4 flex items-center gap-2.5 overflow-x-auto px-4 [scrollbar-width:none] sm:contents">
                  <Chip selected={category === 'all'} onClick={() => setCategory('all')}>
                    All
                  </Chip>
                  {CATEGORIES.map((c) => (
                    <Chip
                      key={c.value}
                      selected={category === c.value}
                      onClick={() => setCategory(c.value)}
                    >
                      {c.label}
                    </Chip>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2.5 sm:ml-auto xl:ml-0 xl:min-w-0 xl:flex-1 xl:flex-nowrap xl:justify-end">
                  <FilterMenu
                    icon="leaf"
                    value={tag}
                    options={TAG_OPTIONS}
                    onChange={setTag}
                    active={tag !== 'any'}
                  >
                    {tag === 'any' ? 'Dietary tags' : TAG_META[tag].label}
                  </FilterMenu>
                  <FilterMenu
                    value={cost}
                    options={COST_FILTERS.map(({ value, label }) => ({
                      value,
                      label,
                    }))}
                    onChange={setCost}
                    active={cost !== 'any'}
                  >
                    Cost: {costLabel}
                  </FilterMenu>
                </div>
              </div>
            </div>

            <RecipeTable
              recipes={recipes}
              language={language}
              onEdit={openEdit}
              onDelete={setDeleting}
            />

            <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 text-body text-muted xl:whitespace-nowrap">
                Showing {formatInt(recipes.length)} of {formatInt(stats.recipes)} ·{' '}
                {formatInt(stats.translatedFr)} translated to French ({translatedPct}%)
              </p>
              {missingFr > 0 && (
                <Pill tone="warning" dot>
                  {formatInt(missingFr)} missing FR translations
                </Pill>
              )}
            </div>
          </Card>
        </>
      )}

      <RecipeFormModal
        open={formOpen}
        recipe={editing}
        saving={saveRecipe.isPending}
        onClose={closeForm}
        onSubmit={submitForm}
      />

      <DeleteRecipeDialog
        recipe={deleting}
        displayName={deleting ? dishNames(deleting, language).primary : ''}
        loading={removeRecipe.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

function FoodSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[98px] rounded-[20px] bg-white xl:flex-1" />
        ))}
      </div>
      <div className="h-[600px] rounded-[20px] bg-white" />
    </div>
  )
}
