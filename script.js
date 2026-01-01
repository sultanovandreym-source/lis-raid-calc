const cards = document.querySelectorAll('.explosive');
const nextBtn = document.getElementById('nextBtn');

let selected = [];

cards.forEach(card => {
    card.addEventListener('click', () => {
        const id = card.dataset.id;

        if (selected.includes(id)) {
            selected = selected.filter(e => e !== id);
            card.classList.remove('selected');
        } else {
            selected.push(id);
            card.classList.add('selected');
        }

        nextBtn.disabled = selected.length === 0;
    });
});

nextBtn.addEventListener('click', () => {
    alert(
        'Вы выбрали:\n' + selected.join(', ')
    );
});
