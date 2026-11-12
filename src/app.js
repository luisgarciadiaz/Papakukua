// Main application logic - Pápakukua Habit Tracker
// ========================================================
import { loadHabits, saveHabits, addHabit, toggleHabit, deleteHabit, initHabits } from './utils/habits.js'
import { createAddHabitForm, renderHabitList } from './components/AddHabitForm.js'

// Main app initialization
export function initApp() {
  let habits = initHabits()

  function renderAll() {
    const dashboardContainer = document.getElementById('habit-list')
    if (dashboardContainer) renderHabitList(habits, dashboardContainer)

    const habitListContainer = document.getElementById('habit-list-container')
    if (habitListContainer) renderHabitList(habits, habitListContainer)

    const dailyCheckContainer = document.getElementById('daily-check-container')
    if (dailyCheckContainer) renderDailyCheck(habits, dailyCheckContainer)

    const streaksContainer = document.getElementById('streaks-container')
    if (streaksContainer) renderStreaks(habits, streaksContainer)
  }

  function renderDailyCheck(habits, container) {
    container.innerHTML = ''

    if (habits.length === 0) {
      container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-8">No habits to check today</p>'
      return
    }

    habits.forEach(habit => {
      const row = document.createElement('div')
      row.className = 'flex items-center justify-between py-3 border-b dark:bg-gray-700'

      const left = document.createElement('div')
      left.className = 'flex items-center gap-3'

      const checkbox = [PERSON_NAME]checkbox.type = 'checkbox'
      checkbox.id = `daily-check-${habit.id}`
      checkbox.checked = habit.completed
      checkbox.className = 'w-5 h-5 text-green-600 rounded focus:ring-green-500'

      const label = document.createElement('label')
      label.htmlFor = `daily-check-${habit.id}`
      label.className = 'font-medium text-gray-900 dark:text-gray-100'
      label.textContent = habit.name

      left.appendChild(checkbox)
      left.appendChild(label)

      const status = document.createElement('span')
      status.className = `text-sm font-medium ${habit.completed ? 'text-green-600' : 'text-gray-500'}`
      status.textContent = habit.completed ? '✓ Completed' : 'Pending'

      const checkBtn = document.createElement('button')
      checkBtn.type = 'button'
      checkBtn.id = `check-${habit.id}`
      checkBtn.className = 'btn-check'
      checkBtn.textContent = habit.completed ? '✓ Done' : 'Check In'
      checkBtn.addEventListener('click', () => {
        habits = toggleHabit(habits, habit.id)
        saveHabits(habits)
        renderAll()
      })

      checkbox.addEventListener('change', () => {
        habits = toggleHabit(habits, habit.id)
        saveHabits(habits)
        renderAll()
      })

      row.appendChild(left)
      row.appendChild(status)
      row.appendChild(checkBtn)
      container.appendChild(row)
    })
  }

  function renderStreaks(habits, container) {
    container.innerHTML = ''

    const sorted = [...habits].sort((a, b) => b.streak - a.streak)

    if (sorted.length === 0) {
      container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-8">No streaks yet. Start checking in!</p>'
      return
    }

    sorted.forEach(habit => {
      const row = document.createElement('div')
      row.className = 'flex items-center justify-between py-3 border-b dark:bg-gray-700'

      const left = document.createElement('div')
      left.className = 'flex items-center gap-3'

      const icon = [PERSON_NAME]icon.className = 'text-2xl'
      icon.textContent = habit.streak > 0 ? '🔥' : '⚡'

      const name = document.createElement('span')
      name.className = 'font-medium text-gray-900 dark:text-gray-100'
      name.textContent = habit.name

      const category = document.createElement('span')
      category.className = 'category-badge ml-2 text-xs'
      category.textContent = habit.category

      left.appendChild(icon)
      left.appendChild(name)
      left.appendChild(category)

      const right = document.createElement('div')
      right.className = 'text-right'

      const streakNum = document.createElement('p')
      streakNum.className = 'text-2xl font-bold text-orange-600 dark:text-orange-400'
      streakNum.textContent = habit.streak

      const streakLabel = document.createElement('p')
      streakLabel.className = 'text-xs text-gray-500 dark:text-gray-400'
      streakLabel.textContent = habit.streak === 1 ? 'day' : 'days'

      right.appendChild(streakNum)
      right.appendChild(streakLabel)

      row.appendChild(left)
      row.appendChild(right)
      container.appendChild(row)
    })
  }

  function wireAddHabit() {
    const addHabitBtn = document.getElementById('add-habit-btn')
    if (!addHabitBtn) return

    addHabitBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('habit-name-input')
      const categorySelect = document.getElementById('habit-category-select')
      if (!nameInput) return

      const name = nameInput.value.trim()
      const category = categorySelect ? categorySelect.value : 'General'

      if (!name) {
        alert('Please enter a habit name')
        return
      }

      habits = addHabit(habits, name, category)
      saveHabits(habits)
      nameInput.value = ''
      nameInput.focus()
      renderAll()
    })
  }

  function wireHabitEvents() {
    document.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const habitId = btn.dataset.delete
        habits = deleteHabit(habits, habitId)
        saveHabits(habits)
        renderAll()
      })
    })

    document.querySelectorAll('[data-check]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const habitId = btn.dataset.check
        habits = toggleHabit(habits, habitId)
        saveHabits(habits)
        renderAll()
      })
    })
  }

  function init() {
    wireAddHabit()
    wireHabitEvents()
    renderAll()

    return {
      getHabits: () => habits,
      refresh: renderAll,
      add: (name, category) => { habits = addHabit(habits, name, category); saveHabits(habits); renderAll() },
      toggle: (habitId) => { habits = toggleHabit(habits, habitId); saveHabits(habits); renderAll() },
      delete: (habitId) => { habits = deleteHabit(habits, habitId); saveHabits(habits); renderAll() },
    }
  }

  const app = init()

  return app
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.papaKukua = initApp()
})