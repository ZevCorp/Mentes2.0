document.addEventListener('DOMContentLoaded', () => {
    const habitBody = document.getElementById('habitBody');
    const dateHeader = document.getElementById('dateHeader');
    const entriesGrid = document.getElementById('entriesGrid');

    // Configuration: Session #1 was Feb 10, 2026.
    const session1Date = new Date(2026, 1, 10); // Feb 10 (Months are 0-indexed)
    const today = new Date(2026, 2, 11); // Current time March 11

    // Calculate total days from Session 1 to Today
    const timeDiff = today.getTime() - session1Date.getTime();
    const daysSinceStart = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    const daysToShow = Math.max(daysSinceStart, 28); // Show at least 4 weeks

    const habitsList = [
        // Session 2 enabled (Week 2+)
        { id: 1, name: 'El Narrador', session: 2 },
        { id: 2, name: 'Delegar a mi yo futuro', session: 2 },
        { id: 3, name: 'Actuar en los primeros 2 segundos', session: 2 },
        { id: 4, name: 'Encuerparme', session: 2 },
        { id: 5, name: 'Mudras', session: 2 },
        { id: 6, name: 'Hacerlo fácil', session: 2 },
        { id: 7, name: 'Entegárselo a Dios / mi subconsciente', session: 2 },

        // Session 3 enabled (Week 3+)
        { id: 8, name: 'Entrar en modo cacería', session: 3 },
        { id: 9, name: 'Simular una pelea con tensión máxima', session: 3 },
        { id: 10, name: 'Identificar mis emoveres y accionarlos', session: 3 },

        // Session 4 enabled (Week 4+)
        { id: 11, name: 'Obmocionarme', session: 4 }
    ];

    // Generate Dates starting from Session 1
    const dates = [];
    for (let i = 0; i < daysToShow; i++) {
        const d = new Date(session1Date);
        d.setDate(session1Date.getDate() + i);
        dates.push(d);
    }

    // Initialize or get data from localStorage
    let habitData = JSON.parse(localStorage.getItem('habit_tracker_data_v2')) || {};

    // Simulation logic
    const resetSimulation = () => {
        habitData = {};
        dates.forEach((date, dateIdx) => {
            const dateStr = date.toISOString().split('T')[0];
            const weekNum = Math.floor(dateIdx / 7) + 1;

            // User did not attend week 1, so no habits marked then.
            if (weekNum > 1) {
                habitsList.forEach(habit => {
                    if (weekNum >= habit.session) {
                        // Simulation: higher success rate as weeks progress
                        const probability = weekNum === 2 ? 0.6 : (weekNum === 3 ? 0.75 : 0.85);
                        const isDone = Math.random() < probability;
                        const key = `${dateStr}-${habit.id}`;
                        habitData[key] = isDone;
                    }
                });
            }
        });
        localStorage.setItem('habit_tracker_data_v2', JSON.stringify(habitData));
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
        th.innerHTML = `<div>${weekday}</div><div style="font-size: 1rem; color: #fff; margin: 4px 0;">${day}</div><div style="font-size: 0.65rem; opacity: 0.5;">${month}</div>`;
        dateHeader.appendChild(th);
    });

    // Render Habits Rows
    habitsList.forEach(habit => {
        const tr = document.createElement('tr');

        // Name Column
        const tdName = document.createElement('td');
        tdName.className = 'sticky-col';
        tdName.innerHTML = `<div style="font-size: 0.9rem;">${habit.name}</div>`;
        tr.appendChild(tdName);

        // Date Columns
        dates.forEach((date, dateIdx) => {
            const dateStr = date.toISOString().split('T')[0];
            const weekNum = Math.floor(dateIdx / 7) + 1;
            const td = document.createElement('td');
            td.className = 'habit-cell';

            const key = `${dateStr}-${habit.id}`;
            const isEnabled = weekNum >= habit.session;

            if (isEnabled) {
                const box = document.createElement('div');
                box.className = `check-box ${habitData[key] ? 'checked' : ''}`;
                box.innerHTML = habitData[key] ? '✕' : '';
                box.style.fontSize = '10px';

                td.addEventListener('click', () => {
                    habitData[key] = !habitData[key];
                    box.classList.toggle('checked');
                    box.innerHTML = habitData[key] ? '✕' : '';
                    localStorage.setItem('habit_tracker_data_v2', JSON.stringify(habitData));
                });

                td.appendChild(box);
            } else {
                td.innerHTML = '<span style="color: #2d2d35; font-size: 1.2rem;">·</span>';
                td.style.cursor = 'default';
            }

            tr.appendChild(td);
        });

        habitBody.appendChild(tr);
    });

    // Render Diary Entries (Empty & Expandable)
    dates.slice(-14).reverse().forEach(date => {
        const dateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
        const entryCard = document.createElement('div');
        entryCard.className = 'entry-card';
        entryCard.innerHTML = `
            <div class="entry-date" style="font-size: 0.9rem; font-weight: 500;">${dateStr}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Sin entrada guardada...</div>
            <div style="font-size: 0.65rem; color: #fff; border: 1px solid #2d2d35; padding: 4px 10px; border-radius: 4px; font-weight: 500; cursor: pointer;">EDITAR</div>
        `;
        entriesGrid.appendChild(entryCard);
    });

    // Expansion Logic
    const entriesHeader = document.querySelector('.entries-header');
    entriesHeader.addEventListener('click', () => {
        entriesGrid.classList.toggle('expanded');
        const arrow = entriesHeader.querySelector('.arrow');
        if (arrow) arrow.style.transform = entriesGrid.classList.contains('expanded') ? 'rotate(180deg)' : 'rotate(0deg)';
    });
});
