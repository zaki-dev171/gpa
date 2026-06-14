// ========== LANGUAGE DATA ==========
const translations = {
    ar: {
        // Navigation & common
        navHome: "الرئيسية",
        navPrivacy: "سياسة الخصوصية",
        navAbout: "من نحن",
        navContact: "اتصل بنا",
        // Header on each page can be set separately, but we'll set generic
        footerText: "جميع الحسابات تتم في متصفحك فقط",
        privacyFooter: "لا نقوم بحفظ أو تخزين أي بيانات شخصية",
        // For calculator page
        subjectNamePlaceholder: "المادة",
        coefficientLabel: "المعامل",
        evaluationLabel: "نوع التقييم",
        examOption: "اختبار فقط",
        examTDOption: "اختبار + TD",
        examTPOption: "اختبار + TP",
        examTDTPOption: "اختبار + TD + TP",
        examGradeLabel: "نقطة الاختبار (100%)",
        examGradeLabel60: "نقطة الاختبار (60%)",
        tdGradeLabel: "نقطة TD (40%)",
        tpGradeLabel: "نقطة TP (40%)",
        tdGradeLabel2: "نقطة TD (20%)",
        tpGradeLabel2: "نقطة TP (20%)",
        deleteButton: "🗑️ حذف المادة",
        addSubjectButton: "إضافة مادة جديدة",
        calculateButton: "احسب المعدل العام",
        finalGPATitle: "المعدل العام الخاص بك",
        gpaScale: "من 20",
        totalSubjectsLabel: "عدد المواد",
        totalCoeffLabel: "مجموع المعاملات",
        resetButton: "إعادة الحساب",
        backToHome: "← العودة للرئيسية"
    },
    en: {
        navHome: "Home",
        navPrivacy: "Privacy Policy",
        navAbout: "About Us",
        navContact: "Contact Us",
        footerText: "All calculations are done in your browser only",
        privacyFooter: "We do not save or store any personal data",
        subjectNamePlaceholder: "Subject",
        coefficientLabel: "Coefficient",
        evaluationLabel: "Evaluation Type",
        examOption: "Exam only",
        examTDOption: "Exam + TD",
        examTPOption: "Exam + TP",
        examTDTPOption: "Exam + TD + TP",
        examGradeLabel: "Exam Grade (100%)",
        examGradeLabel60: "Exam Grade (60%)",
        tdGradeLabel: "TD Grade (40%)",
        tpGradeLabel: "TP Grade (40%)",
        tdGradeLabel2: "TD Grade (20%)",
        tpGradeLabel2: "TP Grade (20%)",
        deleteButton: "🗑️ Delete Subject",
        addSubjectButton: "Add New Subject",
        calculateButton: "Calculate Overall GPA",
        finalGPATitle: "Your Overall GPA",
        gpaScale: "out of 20",
        totalSubjectsLabel: "Total Subjects",
        totalCoeffLabel: "Total Coefficients",
        resetButton: "Reset Calculator",
        backToHome: "← Back to Home"
    },
    fr: {
        navHome: "Accueil",
        navPrivacy: "Confidentialité",
        navAbout: "À Propos",
        navContact: "Contact",
        footerText: "Tous les calculs sont effectués dans votre navigateur",
        privacyFooter: "Aucune donnée personnelle sauvegardée",
        subjectNamePlaceholder: "Matière",
        coefficientLabel: "Coefficient",
        evaluationLabel: "Type d'évaluation",
        examOption: "Examen seulement",
        examTDOption: "Examen + TD",
        examTPOption: "Examen + TP",
        examTDTPOption: "Examen + TD + TP",
        examGradeLabel: "Note d'examen (100%)",
        examGradeLabel60: "Note d'examen (60%)",
        tdGradeLabel: "Note TD (40%)",
        tpGradeLabel: "Note TP (40%)",
        tdGradeLabel2: "Note TD (20%)",
        tpGradeLabel2: "Note TP (20%)",
        deleteButton: "🗑️ Supprimer",
        addSubjectButton: "Ajouter une matière",
        calculateButton: "Calculer la moyenne",
        finalGPATitle: "Votre moyenne générale",
        gpaScale: "sur 20",
        totalSubjectsLabel: "Nombre de matières",
        totalCoeffLabel: "Somme coefficients",
        resetButton: "Réinitialiser",
        backToHome: "← Retour à l'accueil"
    }
};

let currentLanguage = 'ar';
let subjectCounter = 0;
let saveTimeout = null;

// Initialize language and UI
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('gpaCalculatorLanguage');
    if (savedLang && translations[savedLang]) currentLanguage = savedLang;
    applyTranslationsToPage();

    // Language dropdown toggle
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.getElementById('langDropdown');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });
    }
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-switcher')) langDropdown.classList.remove('show');
    });

    // Handle language options
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            const lang = opt.getAttribute('data-lang');
            if (lang) changeLanguage(lang);
        });
    });

    // Load calculator data if on index page
    if (document.getElementById('subjectsContainer')) {
        loadSavedData();
        if (document.querySelectorAll('.subject-card').length === 0) addSubject();
    }
});

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('gpaCalculatorLanguage', lang);
    // Update active class
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
    // Update flag display
    const flags = { ar: '🇩🇿', en: '🇬🇧', fr: '🇲🇫' };
    const names = { ar: 'العربية', en: 'English', fr: 'Français' };
    document.getElementById('currentLangFlag').textContent = flags[lang];
    document.getElementById('currentLangName').textContent = names[lang];
    applyTranslationsToPage();
    autoSaveData(); // re-save with new language context (not necessary but safe)
}

function applyTranslationsToPage() {
    const t = translations[currentLanguage];
    // Update navigation links text (if they are dynamic)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    // Update footer
    const footerText = document.getElementById('footerText');
    if (footerText) footerText.textContent = t.footerText;
    const privacyFooter = document.getElementById('privacyFooterText');
    if (privacyFooter) privacyFooter.textContent = t.privacyFooter;

    // For calculator page specific elements
    if (document.getElementById('addSubjectButton')) {
        document.getElementById('addSubjectButton').innerHTML = `<span style="font-size:1.5rem;">+</span><span>${t.addSubjectButton}</span>`;
        document.getElementById('calculateButton').textContent = t.calculateButton;
        document.getElementById('finalGPATitle').textContent = t.finalGPATitle;
        document.getElementById('gpaScale').textContent = t.gpaScale;
        document.getElementById('totalSubjectsLabel').textContent = t.totalSubjectsLabel;
        document.getElementById('totalCoeffLabel').textContent = t.totalCoeffLabel;
        document.getElementById('resetButton').textContent = t.resetButton;
        // Update existing subjects
        updateExistingSubjects();
    }
    // For info pages, translate static content (we'll set data-i18n attributes in HTML)
}

function updateExistingSubjects() {
    const t = translations[currentLanguage];
    document.querySelectorAll('.subject-card').forEach(card => {
        card.querySelector('.subject-name').placeholder = t.subjectNamePlaceholder;
        card.querySelector('.form-group:nth-child(2) label').textContent = t.coefficientLabel;
        card.querySelector('.form-group:nth-child(3) label').textContent = t.evaluationLabel;
        const select = card.querySelector('.evaluation-type');
        select.options[0].text = t.examOption;
        select.options[1].text = t.examTDOption;
        select.options[2].text = t.examTPOption;
        select.options[3].text = t.examTDTPOption;
        const deleteBtn = card.querySelector('.delete-btn');
        if (deleteBtn) deleteBtn.textContent = t.deleteButton;
        // Update grade labels based on selected type
        updateGradeFieldsForCard(card);
    });
}

function updateGradeFieldsForCard(card) {
    const type = card.querySelector('.evaluation-type').value;
    const gradesGrid = card.querySelector('.grades-grid');
    const t = translations[currentLanguage];
    const examValue = card.querySelector('.exam-grade')?.value || '';
    const tdValue = card.querySelector('.td-grade')?.value || '';
    const tpValue = card.querySelector('.tp-grade')?.value || '';

    let html = '';
    if (type === 'exam') {
        html = `<div class="grade-input"><label>${t.examGradeLabel}</label><input type="number" min="0" max="20" step="0.25" class="exam-grade" value="${examValue}"></div>`;
    } else if (type === 'exam-td') {
        html = `<div class="grade-input"><label>${t.examGradeLabel60}</label><input type="number" min="0" max="20" step="0.25" class="exam-grade" value="${examValue}"></div>
                <div class="grade-input"><label>${t.tdGradeLabel}</label><input type="number" min="0" max="20" step="0.25" class="td-grade" value="${tdValue}"></div>`;
    } else if (type === 'exam-tp') {
        html = `<div class="grade-input"><label>${t.examGradeLabel60}</label><input type="number" min="0" max="20" step="0.25" class="exam-grade" value="${examValue}"></div>
                <div class="grade-input"><label>${t.tpGradeLabel}</label><input type="number" min="0" max="20" step="0.25" class="tp-grade" value="${tpValue}"></div>`;
    } else if (type === 'exam-td-tp') {
        html = `<div class="grade-input"><label>${t.examGradeLabel60}</label><input type="number" min="0" max="20" step="0.25" class="exam-grade" value="${examValue}"></div>
                <div class="grade-input"><label>${t.tdGradeLabel2}</label><input type="number" min="0" max="20" step="0.25" class="td-grade" value="${tdValue}"></div>
                <div class="grade-input"><label>${t.tpGradeLabel2}</label><input type="number" min="0" max="20" step="0.25" class="tp-grade" value="${tpValue}"></div>`;
    }
    gradesGrid.innerHTML = html;
}

// Calculator functions
function addSubject() {
    subjectCounter++;
    const container = document.getElementById('subjectsContainer');
    const t = translations[currentLanguage];
    const div = document.createElement('div');
    div.className = 'subject-card';
    div.id = `subject-${subjectCounter}`;
    div.innerHTML = `
        <div class="subject-header">
            <div class="form-group"><label>${t.subjectNamePlaceholder}</label><input type="text" class="subject-name" placeholder="${t.subjectNamePlaceholder}"></div>
            <div class="form-group"><label>${t.coefficientLabel}</label><input type="number" min="1" max="10" value="1" class="subject-coefficient"></div>
            <div class="form-group"><label>${t.evaluationLabel}</label>
                <select class="evaluation-type" onchange="onEvaluationChange(this)">
                    <option value="exam">${t.examOption}</option>
                    <option value="exam-td">${t.examTDOption}</option>
                    <option value="exam-tp">${t.examTPOption}</option>
                    <option value="exam-td-tp">${t.examTDTPOption}</option>
                </select>
            </div>
        </div>
        <div class="grades-grid"></div>
        <div class="subject-result" id="result-${subjectCounter}"></div>
        <button class="delete-btn" onclick="deleteSubject(${subjectCounter})">${t.deleteButton}</button>
    `;
    container.appendChild(div);
    updateGradeFieldsForCard(div);
    attachInputEvents(div);
    autoSaveData();
}

function onEvaluationChange(select) {
    const card = select.closest('.subject-card');
    updateGradeFieldsForCard(card);
    attachInputEvents(card);
    autoSaveData();
}

function attachInputEvents(card) {
    card.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => autoSaveData()));
    card.querySelector('.subject-name').addEventListener('input', () => autoSaveData());
    card.querySelector('.subject-coefficient').addEventListener('input', () => autoSaveData());
}

function deleteSubject(id) {
    const el = document.getElementById(`subject-${id}`);
    if (el) el.remove();
    autoSaveData();
}

function calculateSubjectGPA(card) {
    const type = card.querySelector('.evaluation-type').value;
    const exam = parseFloat(card.querySelector('.exam-grade')?.value) || 0;
    if (type === 'exam') return exam;
    const td = parseFloat(card.querySelector('.td-grade')?.value) || 0;
    const tp = parseFloat(card.querySelector('.tp-grade')?.value) || 0;
    if (type === 'exam-td') return exam * 0.6 + td * 0.4;
    if (type === 'exam-tp') return exam * 0.6 + tp * 0.4;
    if (type === 'exam-td-tp') return exam * 0.6 + ((td + tp) / 2) * 0.4;
    return 0;
}

function calculateGPA() {
    const cards = document.querySelectorAll('.subject-card');
    if (!cards.length) { alert('أضف مادة أولاً'); return; }
    let totalWeighted = 0, totalCoeff = 0, valid = 0;
    cards.forEach(card => {
        const name = card.querySelector('.subject-name').value.trim();
        const coeff = parseFloat(card.querySelector('.subject-coefficient').value) || 0;
        if (!name || coeff === 0) return;
        const gpa = calculateSubjectGPA(card);
        totalWeighted += gpa * coeff;
        totalCoeff += coeff;
        valid++;
        const resultDiv = card.querySelector('.subject-result');
        resultDiv.textContent = `${translations[currentLanguage].finalGPATitle || 'معدل المادة:'} ${gpa.toFixed(2)} / 20`;
        resultDiv.classList.add('show');
    });
    if (valid === 0) { alert('أدخل بيانات مادة صحيحة'); return; }
    const final = totalWeighted / totalCoeff;
    const gpaValSpan = document.getElementById('gpaValue');
    gpaValSpan.textContent = final.toFixed(2);
    gpaValSpan.classList.toggle('pass', final >= 10);
    gpaValSpan.classList.toggle('fail', final < 10);
    document.getElementById('totalSubjects').textContent = valid;
    document.getElementById('totalCoefficients').textContent = totalCoeff;
    document.getElementById('resultsSection').classList.add('show');
    autoSaveData();
}

function resetCalculator() {
    document.querySelectorAll('.subject-card').forEach(card => {
        card.querySelectorAll('input').forEach(inp => inp.value = '');
        card.querySelector('.subject-result').classList.remove('show');
    });
    document.getElementById('resultsSection').classList.remove('show');
    autoSaveData();
}

function autoSaveData() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const cards = document.querySelectorAll('.subject-card');
        const data = [];
        cards.forEach(card => {
            data.push({
                name: card.querySelector('.subject-name').value,
                coefficient: card.querySelector('.subject-coefficient').value,
                evaluationType: card.querySelector('.evaluation-type').value,
                examGrade: card.querySelector('.exam-grade')?.value || '',
                tdGrade: card.querySelector('.td-grade')?.value || '',
                tpGrade: card.querySelector('.tp-grade')?.value || ''
            });
        });
        localStorage.setItem('gpaCalculatorData', JSON.stringify(data));
    }, 500);
}

function loadSavedData() {
    const saved = localStorage.getItem('gpaCalculatorData');
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        document.getElementById('subjectsContainer').innerHTML = '';
        subjectCounter = 0;
        data.forEach(item => {
            addSubject();
            const card = document.getElementById(`subject-${subjectCounter}`);
            card.querySelector('.subject-name').value = item.name;
            card.querySelector('.subject-coefficient').value = item.coefficient;
            card.querySelector('.evaluation-type').value = item.evaluationType;
            updateGradeFieldsForCard(card);
            setTimeout(() => {
                if (item.examGrade) card.querySelector('.exam-grade').value = item.examGrade;
                if (item.tdGrade && card.querySelector('.td-grade')) card.querySelector('.td-grade').value = item.tdGrade;
                if (item.tpGrade && card.querySelector('.tp-grade')) card.querySelector('.tp-grade').value = item.tpGrade;
            }, 50);
            attachInputEvents(card);
        });
    } catch(e) {}
}
