// Données des objets
const objectsData = {
    'cantonal-initiative-1': {
        type: 'Initiative populaire cantonale',
        title: 'IN « Initiative piétonne »',
        text: `L'initiative populaire « Initiative piétonne » vise à créer des zones piétonnes sécurisées dans les quartiers résidentiels du canton de Genève. 
        Elle propose de limiter la circulation automobile dans certaines rues et d'aménager des espaces publics favorisant la mobilité douce.
        <br><br>
        Les objectifs principaux sont :
        <br>• Améliorer la sécurité des piétons, notamment des enfants et des personnes âgées
        <br>• Réduire la pollution atmosphérique et sonore
        <br>• Favoriser les déplacements à pied et à vélo
        <br>• Créer des espaces de rencontre et de convivialité`,
        comite: ['Marie Dupont de Genève', 'Jean Martin de Carouge', 'Sophie Bernard de Vernier'],
        url: 'https://verts-ge.ch/les-vert-e-s-lancent-une-initiative-cantonale-initiative-pietonne-pour-un-canton-qui-marche/',
        signed: true,
        signatureDate: '15.10.2025',
        signatureTime: '14:32',
        signatureMode: 'PAPIER'
    },
    'cantonal-referendum-1': {
        type: 'Référendum cantonal',
        title: 'Loi 10843 modifiant les limites de zones sur le territoire de la commune de Vernier',
        subtitle: '(création d\'une zone de développement 3 entre l\'avenue Louis-Casaï et le chemin des Corbillettes)',
        text: `Ce référendum porte sur la modification de la loi 10843 qui vise à modifier les limites de zones sur le territoire de la commune de Vernier.
        <br><br>
        Le projet prévoit la création d'une zone de développement 3 entre l'avenue Louis-Casaï et le chemin des Corbillettes, permettant la construction de nouveaux logements et infrastructures.`,
        comite: ['Pierre Durand de Genève', 'Isabelle Leclerc de Carouge', 'Marc Favre de Vernier', 'Anne-Marie Roux de Meyrin'],
        url: 'https://www.ge.ch/dossier/loi-10843-modification-limites-zones',
        signed: false
    },
    'communal-referendum-1': {
        type: 'Référendum communal',
        title: 'Référendum contre la délibération du Conseil municipal de Bardonnex',
        subtitle: 'du 2 septembre 2025, adoptant le règlement relatif à l\'affichage et au concept directeur de la commune de Bardonnex',
        text: `Ce référendum communal porte sur la délibération du Conseil municipal de Bardonnex du 2 septembre 2025.
        <br><br>
        La délibération adopte un nouveau règlement relatif à l'affichage et au concept directeur de la commune.`,
        comite: ['François Blanc de Genève', 'Nathalie Rossi de Carouge', 'Luc Mercier de Bardonnex'],
        url: 'https://www.bardonnex.ch/referendum-reglement-affichage',
        signed: false
    }
};

let currentObjectId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    updateSignedIndicators();
    
    // Fermeture modals par clic overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    });
});

// Afficher les indicateurs ✓ pour objets signés
function updateSignedIndicators() {
    Object.keys(objectsData).forEach(objectId => {
        if (objectsData[objectId].signed) {
            const indicator = document.getElementById('signed-' + objectId);
            if (indicator) {
                indicator.style.display = 'inline-block';
            }
        }
    });
}

// Afficher détail d'un objet
function showDetail(objectId) {
    currentObjectId = objectId;
    const obj = objectsData[objectId];
    
    // Si déjà signé, afficher modal
    if (obj.signed) {
        document.getElementById('signatureDate').textContent = obj.signatureDate;
        document.getElementById('signatureTime').textContent = obj.signatureTime;
        document.getElementById('signatureMode').textContent = obj.signatureMode;
        document.getElementById('modalAlreadySigned').classList.add('active');
        return;
    }

    // Sinon afficher page détail avec contenu dynamique
    document.getElementById('detailObjectType').textContent = obj.type;
    document.getElementById('detailTitle').textContent = obj.title;
    document.getElementById('detailText').innerHTML = obj.text;
    
    // Mise à jour dynamique du comité
    const comiteText = obj.comite.join(', ');
    document.getElementById('comiteMembers').textContent = comiteText;
    
    // Mise à jour dynamique de l'URL
    const externalLink = document.getElementById('externalLink');
    externalLink.href = obj.url;
    
    document.getElementById('listPage').style.display = 'none';
    document.getElementById('detailPage').classList.add('active');
}

// Retour à la liste
function showList() {
    document.getElementById('detailPage').classList.remove('active');
    document.getElementById('listPage').style.display = 'block';
    currentObjectId = null;
}

// Confirmer soutien
function confirmSupport() {
    document.getElementById('modalConfirm').classList.add('active');
}

// Annuler soutien
function cancelSupport() {
    document.getElementById('modalConfirm').classList.remove('active');
    showList();
}

// Valider soutien
function validateSupport() {
    const now = new Date();
    const obj = objectsData[currentObjectId];
    
    obj.signed = true;
    obj.signatureDate = now.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
    obj.signatureTime = now.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' });
    obj.signatureMode = 'ÉLECTRONIQUE';

    updateSignedIndicators();
    document.getElementById('modalConfirm').classList.remove('active');

    const successMsg = document.createElement('div');
    successMsg.className = 'success-box';
    successMsg.innerHTML = `
        <h4>✓ Soutien enregistré</h4>
        <p>Votre soutien a bien été enregistré le ${obj.signatureDate} à ${obj.signatureTime}</p>
    `;
    
    // Trouver le conteneur approprié (main-content ou container)
    const mainContent = document.querySelector('.main-content') || document.querySelector('.container');
    if (mainContent) {
        mainContent.insertBefore(successMsg, mainContent.firstChild);
        
        setTimeout(() => {
            successMsg.remove();
            showList();
        }, 2000);
    } else {
        // Fallback si aucun conteneur n'est trouvé
        console.error('Conteneur principal introuvable');
        showList();
    }
}

// Afficher formulaire fraude
function showFraudDeclaration() {
    const obj = objectsData[currentObjectId];
    
    document.getElementById('modalAlreadySigned').classList.remove('active');
    document.getElementById('fraudObjectTitle').textContent = obj.title;
    document.getElementById('fraudSignatureDate').textContent = obj.signatureDate;
    document.getElementById('fraudSignatureTime').textContent = obj.signatureTime;
    document.getElementById('modalFraudDeclaration').classList.add('active');
}

// Annuler déclaration fraude
function cancelFraudDeclaration() {
    document.getElementById('fraudDescription').value = '';
    document.getElementById('modalFraudDeclaration').classList.remove('active');
    document.getElementById('modalAlreadySigned').classList.add('active');
}

// Soumettre déclaration fraude
function submitFraudDeclaration() {
    const description = document.getElementById('fraudDescription').value;
    
    if (!description || description.trim() === '') {
        alert('Veuillez décrire la situation avant de déposer votre déclaration.');
        return;
    }
    
    const obj = objectsData[currentObjectId];
    
    // Simuler enregistrement (remplacer par appel API)
    console.log('Déclaration de fraude:', {
        objectId: currentObjectId,
        objectTitle: obj.title,
        signatureDate: obj.signatureDate,
        signatureTime: obj.signatureTime,
        description: description,
        timestamp: new Date().toISOString()
    });
    
    document.getElementById('fraudDescription').value = '';
    document.getElementById('modalFraudDeclaration').classList.remove('active');
    document.getElementById('modalFraudConfirmation').classList.add('active');
}

// Fermer confirmation fraude
function closeFraudConfirmation() {
    document.getElementById('modalFraudConfirmation').classList.remove('active');
    showList();
}

// Fermer toutes les modals
function closeModal() {
    document.getElementById('modalAlreadySigned').classList.remove('active');
    document.getElementById('modalConfirm').classList.remove('active');
    document.getElementById('modalFraudDeclaration').classList.remove('active');
    document.getElementById('modalFraudConfirmation').classList.remove('active');
}

// Fonction pour basculer l'état de la section "Mes autres espaces"
function toggleSection(button) {
    const arrow = button.querySelector('.sidebar-section-arrow');
    const subsection = button.nextElementSibling;
    const isExpanded = arrow.classList.contains('expanded');
    
    if (isExpanded) {
        arrow.classList.remove('expanded');
        subsection.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');
    } else {
        arrow.classList.add('expanded');
        subsection.style.display = 'block';
        button.setAttribute('aria-expanded', 'true');
    }
}