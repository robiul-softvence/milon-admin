import type { Goal, InjuryZone, Subscription, User, UserStats } from '../types'

export const AVATAR_COLORS = ['#ff654f', '#3478c8', '#25845c', '#d68a25', '#111318', '#7a5af8']

/** The eight members shown in the Figma frame (most recent sign-ups). */
const featured: User[] = [
  { id: 10480, name: 'Solène Martin', email: 'solene.martin@example.com', goal: 'loseWeight', injuries: ['wrists'], subscription: 'proAnnual', joinedAt: '2026-09-12', suspended: false, avatarColor: '#ff654f' },
  { id: 10517, name: 'Emma Dubois', email: 'emma.dubois@example.com', goal: 'loseWeight', injuries: ['knees'], subscription: 'trial', joinedAt: '2026-11-18', suspended: false, avatarColor: '#3478c8' },
  { id: 10554, name: 'Lucas Bernard', email: 'lucas.bernard@example.com', goal: 'buildMuscle', injuries: [], subscription: 'proMonthly', joinedAt: '2026-10-03', suspended: false, avatarColor: '#25845c' },
  { id: 10591, name: 'Chloé Martin', email: 'chloe.martin@example.com', goal: 'stayFit', injuries: ['lowerBack', 'shoulders'], subscription: 'proQuarterly', joinedAt: '2026-08-21', suspended: false, avatarColor: '#d68a25' },
  { id: 10628, name: 'Noah Petit', email: 'noah.petit@example.com', goal: 'buildMuscle', injuries: ['wrists'], subscription: 'trial', joinedAt: '2026-11-17', suspended: false, avatarColor: '#111318' },
  { id: 10665, name: 'Léa Moreau', email: 'lea.moreau@example.com', goal: 'loseWeight', injuries: [], subscription: 'proMonthly', joinedAt: '2026-07-30', suspended: false, avatarColor: '#7a5af8' },
  { id: 10702, name: 'Hugo Laurent', email: 'hugo.laurent@example.com', goal: 'stayFit', injuries: ['knees'], subscription: 'inactive', joinedAt: '2026-05-14', suspended: false, avatarColor: '#ff654f' },
  { id: 10739, name: 'Inès Garcia', email: 'ines.garcia@example.com', goal: 'loseWeight', injuries: ['shoulders'], subscription: 'proAnnual', joinedAt: '2026-06-02', suspended: false, avatarColor: '#3478c8' },
]

const FIRST = ['Camille', 'Louis', 'Manon', 'Gabriel', 'Jade', 'Arthur', 'Louise', 'Jules', 'Alice', 'Raphaël', 'Lina', 'Adam', 'Rose', 'Paul', 'Anna', 'Nathan', 'Zoé', 'Théo', 'Mila', 'Tom', 'Sarah', 'Maël', 'Eva', 'Victor']
const LAST = ['Lefèvre', 'Roux', 'Fournier', 'Girard', 'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent', 'Muller', 'Blanc', 'Guerin', 'Faure', 'Andre', 'Mercier']
const GOALS: Goal[] = ['loseWeight', 'buildMuscle', 'stayFit']
const SUBS: Subscription[] = ['proMonthly', 'proAnnual', 'trial', 'proQuarterly', 'inactive', 'trial', 'proMonthly']
const ZONES: InjuryZone[] = ['knees', 'wrists', 'lowerBack', 'shoulders', 'neck', 'hips', 'ankles', 'elbows']

const ascii = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Older members (Jan–Apr 2026), generated deterministically. */
const generated: User[] = Array.from({ length: 48 }, (_, i) => {
  const first = FIRST[i % FIRST.length]
  const last = LAST[(i * 7 + 3) % LAST.length]
  const injuryCount = i % 3 === 0 ? 0 : i % 5 === 0 ? 2 : 1
  const injuries = Array.from({ length: injuryCount }, (_, k) => ZONES[(i + k * 3) % ZONES.length])
  const month = 1 + (i % 4)
  const day = 1 + ((i * 11) % 28)
  return {
    id: 10010 + i * 8,
    name: `${first} ${last}`,
    email: `${ascii(first)}.${ascii(last)}@example.com`,
    goal: GOALS[i % 3],
    subscription: SUBS[i % SUBS.length],
    injuries,
    joinedAt: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    suspended: i % 19 === 7,
    avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
  }
})

export const usersSeed: User[] = [...featured, ...generated]

export const userStatsSeed: UserStats = {
  newThisWeek: { value: 842, trend: '14%' },
  trialConversion: { value: 62, trend: '3 pts' },
  injuryFlags: { percent: 38, users: 4742 },
  suspended: 17,
}
