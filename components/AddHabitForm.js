// Add Habit Form Component

export function createAddHabitForm(container, onAdd) {
  if (!container) return null

  // Clear container
  container.innerHTML = ''

  const form = document.createElement('div')
  form.className = 'space-y-3'

  const inputContainer = document.createElement('div')
  inputContainer.className = 'flex gap-2'

  const nameInput = document.createElement('input')
  nameInput.type = 'text'
  nameInput.id = 'habit-name-input'
  nameInput.placeholder = 'Habit name...'
  nameInput.className = 'flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'

  const categorySelect = document.createElement('select')
  categorySelect.id = 'habit-category-select'
  categorySelect.className = 'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
  categorySelect.innerHTML = '<option value="General">General</option><option value="Health">Health</option><option value="Work">Work</option><option value="Learning">Learning</option><option value="Personal">Personal</option>'

  const addBtn = document.createElement('button')
  addBtn.id = 'add-habit-btn'
  addBtn.type = 'button'
  addBtn.className = 'btn-primary'
  addBtn.textContent = '+ Add Habit'

  // Event listeners
  addBtn.addEventListener('click', () => {
    const name = nameInput.value.trim()
    const category = categorySelect.value

    if (!name) {
      alert('Please enter a habit name')
      return
    }

    if (onAdd) onAdd(name, category)
    nameInput.value = ''
    nameInput.focus()
  })

  // Allow Enter key to submit
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click()
  })

  inputContainer.appendChild(nameInput)
  inputContainer.appendChild(categorySelect)
  inputContainer.appendChild(addBtn)
  form.appendChild(inputContainer)

  container.appendChild(form)
}

// Render habit list
export function renderHabitList(habits, container) {
  if (!container) return

  container.innerHTML = ''

  if (habits.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'text-gray-500 dark:text-gray-400 text-center py-8'
    empty.textContent = 'No habits yet. Add your first habit!'
    container.appendChild(empty)
    return
  }

  habits.forEach(habit => {
    const card = document.createElement('div')
    card.id = `habit-card-${habit.id}`
    card.className = 'habit-card'

    const info = document.createElement('div')
    info.className = 'flex-1'

    const name = document.createElement('p')
    name.className = 'font-medium text-gray-900 dark:text-gray-100'
    name.textContent = habit.name

    const category = document.createElement('span')
    category.className = 'category-badge mt-1 inline-block'
    category.textContent = habit.category

    const streak = document.createElement('span')
    streak.className = 'streak-badge mt-2 inline-block'
    streak.textContent = habit.streak > 0 ? `🔥 ${habit.streak} day streak` : 'No streak yet'

    info.appendChild(name)
    info.appendChild(category)
    info.appendChild(streak)

    const actions = document.createElement('div')
    actions.className = 'flex items-center gap-2'

    const checkBtn = document.createElement('button')
    checkBtn.type = 'button'
    checkBtn.id = `check-${habit.id}`
    checkBtn.className = habit.completed
      ? 'btn-check btn-check-checked'
      : 'btn-check'
    checkBtn.textContent = habit.completed ? '✓ Done' : 'Check In'
    checkBtn.addEventListener('click', () => {
      if (onToggle) onToggle(habit.id)
    })

    const deleteBtn = document.createElement('button')
    deleteBtn.type = 'button'
    deleteBtn.id = `delete-${habit.id}`
    deleteBtn.className = 'btn-danger'
    deleteBtn.textContent = '✕'
    deleteBtn.addEventListener('click', () => {
      if (onDelete) onDelete(habit.id)
    })

    actions.appendChild(checkBtn)
    actions.appendChild(deleteBtn)

    card.appendChild(info)
    card.appendChild(actions)
    container.appendChild(card)
  })
}

// Export convenience function for wiring events
export function bindHabitEvents(habitId, events) {
  // This is a placeholder - actual wiring should be handled by main app logic
  return {
    ...events,
    habitId,
  }
}
