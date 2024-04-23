document.addEventListener('DOMContentLoaded', function() {
    const viewBtn = document.getElementById('viewFood');
    const addBtn = document.getElementById('addFood');
    const viewSection = document.getElementById('viewSection');
    const addSection = document.getElementById('addSection');
    const madListeView = document.getElementById('madListeView');
    const madListeAdd = document.getElementById('madListeAdd');
    const addNameBtn = document.getElementById('addNameBtn');
    const navnInput = document.getElementById('nytNavnInput');

    // Skifter visning mellem sektionerne
    viewBtn.addEventListener('click', function() {
        viewSection.classList.remove('hidden');
        addSection.classList.add('hidden');
        loadMadListe(madListeView); // Opdaterer 'Se og tag mad'-listen
    });

    addBtn.addEventListener('click', function() {
        addSection.classList.remove('hidden');
        viewSection.classList.add('hidden');
        loadMadListe(madListeAdd); // Opdaterer 'Indsæt mad'-listen
    });

    // Tilføjer mad og opdaterer begge lister
    addNameBtn.addEventListener('click', function() {
        if (navnInput.value.trim() !== '') {
            const madItem = { navn: navnInput.value.trim(), img: null };
            saveMadItem(madItem);
            navnInput.value = '';
            loadMadListe(madListeView);
            loadMadListe(madListeAdd);
        }
    });

    // Funktion til at oprette mad elementer
    function createMadElement(madItem) {
        const madElement = document.createElement('div');
        madElement.className = 'mad-item';
        madElement.textContent = madItem.navn;

        const imgBtn = document.createElement('button');
        imgBtn.textContent = 'Tilføj/Rediger billede';
        imgBtn.onclick = () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = e => handleImageChange(e, madItem, madElement);
            fileInput.click();
        };

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Rediger navn';
        editBtn.onclick = () => {
            const newNavn = prompt("Rediger navn på mad:", madItem.navn);
            if (newNavn) {
                madItem.navn = newNavn;
                madElement.firstChild.textContent = newNavn;
                saveChanges();
            }
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Slet';
        deleteBtn.onclick = () => {
            madElement.remove();
            removeMadItem(madItem);
            loadMadListe(madListeView);
            loadMadListe(madListeAdd);
        };

        madElement.appendChild(editBtn);
        madElement.appendChild(deleteBtn);
        madElement.appendChild(imgBtn);

        if (madItem.img) {
            const img = document.createElement('img');
            img.src = madItem.img;
            img.style.width = '100px';
            madElement.appendChild(img);
        }

        return madElement;
    }

    // Funktion til at indlæse mad listen fra localStorage og opdatere den givne liste
    function loadMadListe(targetElement) {
        const mads = JSON.parse(localStorage.getItem('madListe')) || [];
        targetElement.innerHTML = '';
        mads.forEach(madItem => targetElement.appendChild(createMadElement(madItem)));
    }

    // Gemmer ændringer i madlisten
    function saveMadItem(madItem) {
        const mads = JSON.parse(localStorage.getItem('madListe')) || [];
        mads.push(madItem);
        localStorage.setItem('madListe', JSON.stringify(mads));
    }

    // Opdaterer madlisten i localStorage efter ændringer
    function saveChanges() {
        const mads = [];
        document.querySelectorAll('.mad-item').forEach(item => {
            const navn = item.childNodes[0].nodeValue;
            const img = item.querySelector('img') ? item.querySelector('img').src : null;
            mads.push({ navn, img });
        });
        localStorage.setItem('madListe', JSON.stringify(mads));
    }

    // Fjerner et mad item fra listen
    function removeMadItem(madItemToRemove) {
        let mads = JSON.parse(localStorage.getItem('madListe')) || [];
        mads = mads.filter(madItem => madItem.navn !== madItemToRemove.navn);
        localStorage.setItem('madListe', JSON.stringify(mads));
    }
});

