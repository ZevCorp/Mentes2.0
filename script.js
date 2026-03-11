document.addEventListener('DOMContentLoaded', () => {
    const habitBody = document.getElementById('habitBody');
    const dateHeader = document.getElementById('dateHeader');
    const entriesGrid = document.getElementById('entriesGrid');

    // Configuration: Today is March 10, 2026. We show 4 weeks (28 days).
    const today = new Date(2026, 2, 10);
    const daysToShow = 28;

    const habitsList = [
        { id: 1, name: 'Encuerparme', weeks: [1, 2, 3, 4] },
        { id: 2, name: 'Actuar en los primeros 2 segundos', weeks: [1, 2, 3, 4] },
        { id: 3, name: 'El Narrador', weeks: [1, 2, 3, 4] },
        { id: 4, name: 'Mudras', weeks: [1, 2, 3, 4] },
        { id: 5, name: 'Hacerlo fácil', weeks: [2, 3, 4] },
        { id: 6, name: 'Entrar en modo cacería', weeks: [2, 3, 4] },
        { id: 7, name: 'Entegárselo a Dios / mi subconsciente', weeks: [2, 3, 4] },
        { id: 8, name: 'Pasar energía de acción a mi yo soñador', weeks: [2, 3, 4] },
        { id: 9, name: 'Delegar a mi yo futuro', weeks: [2, 3, 4] }
    ];

    // Generate Dates
    const dates = [];
    for (let i = daysToShow - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push(d);
    }

    // Initialize or get data from localStorage
    let habitData = JSON.parse(localStorage.getItem('habit_tracker_data')) || {};

    // Simulation logic
    const resetSimulation = () => {
        habitData = {};
        dates.forEach((date, dateIdx) => {
            const dateStr = date.toISOString().split('T')[0];
            // Week logic: 0-6 (W1), 7-13 (W2), 14-20 (W3), 21-27 (W4)
            const weekNum = Math.floor(dateIdx / 7) + 1;

            habitsList.forEach(habit => {
                if (habit.weeks.includes(weekNum)) {
                    // Simulation: 70% chance of completion
                    const isDone = Math.random() > 0.3;
                    const key = `${dateStr}-${habit.id}`;
                    habitData[key] = isDone;
                }
            });
        });
        localStorage.setItem('habit_tracker_data', JSON.stringify(habitData));
        location.reload();
    };

    if (Object.keys(habitData).length === 0) {
        resetSimulation();
    }

    // Render Headers
    dates.forEach(date => {
        const th = document.createElement('th');
        const day = date.getDate();
        const month = date.toLocaleString('es-ES', { month: 'short' });
        const weekday = date.toLocaleString('es-ES', { weekday: 'short' });
        th.innerHTML = `<div>${weekday}</div><div style="font-size: 1.1rem; color: #1e293b; margin: 4px 0;">${day}</div><div style="font-size: 0.7rem; opacity: 0.7;">${month}</div>`;
        dateHeader.appendChild(th);
    });

    // Render Habits Rows
    habitsList.forEach(habit => {
        const tr = document.createElement('tr');

        // Name Column
        const tdName = document.createElement('td');
        tdName.className = 'sticky-col';
        tdName.innerHTML = `<div style="font-weight: 500;">${habit.name}</div>`;
        tr.appendChild(tdName);

        // Date Columns
        dates.forEach((date, dateIdx) => {
            const dateStr = date.toISOString().split('T')[0];
            const weekNum = Math.floor(dateIdx / 7) + 1;
            const td = document.createElement('td');
            td.className = 'habit-cell';

            const key = `${dateStr}-${habit.id}`;
            const isEnabled = habit.weeks.includes(weekNum);

            if (isEnabled) {
                const box = document.createElement('div');
                box.className = `check-box ${habitData[key] ? 'checked' : ''}`;

                td.addEventListener('click', () => {
                    habitData[key] = !habitData[key];
                    box.classList.toggle('checked');
                    localStorage.setItem('habit_tracker_data', JSON.stringify(habitData));
                });

                td.appendChild(box);
            } else {
                td.innerHTML = '<span style="color: #e2e8f0; font-size: 1.5rem;">·</span>';
                td.style.cursor = 'default';
            }

            tr.appendChild(td);
        });

        habitBody.appendChild(tr);
    });

    // Render Diary Entries (Empty)
    // For 4 weeks, let's show placeholders for the last 14 days to keep it clean
    dates.slice(-14).reverse().forEach(date => {
        const dateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
        const entryCard = document.createElement('div');
        entryCard.className = 'entry-card';
        entryCard.innerHTML = `
            <div class="entry-date">${dateStr}</div>
            <div class="entry-placeholder">Sin entrada guardada...</div>
            <div style="margin-top: 1rem; font-size: 0.7rem; opacity: 0.5; font-weight: 500;">CLIC PARA EDITAR</div>
        `;
        entriesGrid.appendChild(entryCard);
    });
});
