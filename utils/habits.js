// Habit Model & localStorage Persistence

const STORAGE_KEY = 'papa-kukua-habits'
const TODAY = new Date().toISOString().split('T')[0]

// Data structure: array of habit objects
// {
//   id: string (unique)
//   name: string
//   category: string (e.g., 'Health', 'Work', 'Learning')
//   completed: boolean (today's status)
//   lastCompleted: string | null (YYYY-MM-DD format)
//   streak: number (consecutive days)
// }

// Load habits from localStorage or return empty array
export function loadHabits() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (serialized === null) return []
    const habits = JSON.parse(serialized)
    return habits.map(h => ({
      id: h.id,
      name: h.name,
      category: h.category || 'General',
      completed: h.completed || false,
      lastCompleted: h.lastCompleted || null,
      streak: h.streak || 0
    }))
  } catch (error) {
    console.error('Failed to load habits from localStorage', error)
    return []
  }
}

// Save habits to localStorage
export function saveHabits(habits) {
  try {
    const serialized = JSON.stringify(habits)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.error('Failed to save habits to localStorage', error)
  }
}

// Generate a simple unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Add a new habit
export function addHabit(habits, name, category) {
  const existing = habits.find(h => h.name.toLowerCase() === name.toLowerCase())
  if (existing) {
    console.warn(`Habit "${name}" already exists`)
    return habits
  }

  const newHabit = {
    id: generateId(),
    name,
    category: category || 'General',
    completed: false,
    lastCompleted: null,
    streak: 0
  }

  const updated = [...habits, newHabit]
  saveHabits(updated)
  return updated
}

// Toggle today's completion for a habit
export function toggleHabit(habits, habitId) {
  const index = habits.findIndex(h => h.id === habitId)
  if (index === -1) {
    console.warn(`Habit with id ${habitId} not found`)
    return habits
  }

  const habit = habits[index]
  const today = new Date().toISOString().split('T')[0]

  // If habit was already completed today, keep it as is (prevents double counting)
  if (habit.completed && habit.lastCompleted === today) {
    return habits
  }

  const updated = habits.map(h =>
    h.id === habitId
      ? { ...h, completed: true, lastCompleted: today }
      : h
  )

  const finalHabits = updated.map(h => {
    if (h.id === habitId) {
      const prevStreak = h.streak
      return {
        ...h,
        completed: true,
        lastCompleted: today,
        streak: prevStreak > 0 ? prevStreak + 1 : 1
      }
    }
    return h
  })

  saveHabits(finalHabits)
  return finalHabits
}

// Delete a habit
export function deleteHabit(habits, habitId) {
  const updated = habits.filter(h => h.id !== habitId)
  saveHabits(updated)
  return updated
}

// Get habits completed today
export function getTodayCompleted(habits) {
  return habits.filter(h => h.completed)
}

// Get habits pending today
export function getTodayPending(habits) {
  return habits.filter(h => !h.completed)
}

// Get habit by ID
export function getHabitById(habits, habitId) {
  return habits.find(h => h.id === habitId) || null
}

// Initialize habits on first load
export function initHabits(initialData = []) {
  let existing = loadHabits()
  if (existing.length === 0) {
    existing = initialData.map(h => ({
      id: h.id || generateId(),
      name: h.name,
      category: h.category || 'General',
      completed: h.completed || false,
      lastCompleted: h.lastCompleted || null,
      streak: h.streak || 0
    }))
    saveHabits(existing)
  }
  return existing
}
