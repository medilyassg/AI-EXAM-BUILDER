require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors(
    {
        origin:["ai-exam-client.vercel.app"],
        methods:['POST','GET'],
        
    }
));
app.use(express.json()); // To parse JSON request bodies

app.get('/', (req, res) => {
  res.send('Hello');
});

app.post('/generate-exam', async (req, res) => {
    const { formData } = req.body;

    try {
        if (!formData || typeof formData !== 'object') {
            return res.status(400).json({ error: 'Données de formulaire invalides.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = constructGeminiPrompt(formData);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Convertir le texte en format JSON compatible avec Syncfusion
        const examJson = convertTextToJson(text);

        res.json({ examJson: examJson });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Échec de la génération de l\'examen.' });
    }
});

function constructGeminiPrompt(formData) {
    return `Générer un examen complet et détaillé, formaté selon les instructions fournies, en utilisant le contenu du document téléchargé comme base.

**Informations de Base :**
- Matière : ${formData.subject}
- Niveau scolaire : ${formData.gradeLevel}
- Chapitre/Cours (contenu du document) : ${formData.topicText}
- Type d'évaluation : ${formData.examType}
- Durée proposée : ${formData.timeLimit} minutes
- Langue de l'examen : ${formData.language}

**Paramètres de l'Examen :**
- Nombre total de questions : ${formData.totalQuestions}
- Types de questions : ${formData.questionTypes.join(', ')}
- Niveau de difficulté : ${formData.difficulty}
- Mots-clés/Concepts clés : ${formData.keywords}

**Informations Supplémentaires :**
- Objectifs pédagogiques : ${formData.objectifsPedagogiques}
- Contraintes spécifiques : ${formData.contraintesSpecifiques}
- Exemples de questions : ${formData.exemplesQuestions}

**Instructions Détaillées pour la Génération des Questions :**
${formData.questionTypes.includes('MCQ') ? `- Pour les questions à choix multiples, fournir des options claires et pertinentes.` : ''}
${formData.questionTypes.includes('TrueFalse') ? `- Pour les questions vrai/faux, s'assurer que les affirmations sont précises et testables.` : ''}
${formData.questionTypes.includes('ShortAnswer') ? `- Pour les questions à réponse courte, limiter la longueur des réponses attendues et fournir des consignes claires.` : ''}
${formData.questionTypes.includes('Essay') ? `- Pour les essais, fournir des consignes détaillées et des critères d'évaluation.` : ''}
${formData.questionTypes.includes('ProblemSolving') ? `- Pour les problèmes, inclure toutes les données nécessaires et les étapes de résolution pertinentes.` : ''}

**Alignement Pédagogique et Directives :**
- L'examen doit évaluer les objectifs pédagogiques suivants : ${formData.objectifsPedagogiques}.
- Respecter les contraintes spécifiques suivantes : ${formData.contraintesSpecifiques}.
- Utiliser les exemples de questions suivants comme référence : ${formData.exemplesQuestions}.
- Les questions doivent être adaptées au niveau scolaire (${formData.gradeLevel}) et à la matière (${formData.subject}).
- Les questions doivent couvrir les concepts clés du document téléchargé.
- Les questions doivent être claires, concises et pertinentes par rapport au contenu du document.
- Les questions doivent être alignées sur les niveaux de la Taxonomie de Bloom, couvrant la connaissance, la compréhension, l'application, l'analyse, l'évaluation et la création.
- Inclure des questions qui nécessitent des verbes d'action spécifiques tels que "analyser", "comparer", "synthétiser", etc.

**Format et Présentation :**
- Formatez l'examen dans la langue spécifiée : ${formData.language}.
- Utilisez une mise en page et mise en form claire et professionnelle comme une fichier microsoft word .
- N'indiquez pas les réponses correctes.
- Intégrez des diagrammes, des tableaux ou des équations, le cas échéant, pour améliorer la clarté des questions.

**Contraintes et Directives Spécifiques :**
- Respecter les contraintes de temps : ${formData.timeLimit} minutes.
- Maintenir un ton professionnel et éducatif.
- Assurer que les questions sont logiquement structurées et pertinentes par rapport au contenu.

**Directives de Sortie :**
- Générez l'examen en respectant scrupuleusement ces paramètres et instructions.
- Assurez-vous que l'examen est complet, cohérent et prêt à être utilisé.
- Générez uniquement l'examen formaté, sans introduction ni explications supplémentaires.
donner moi directement le contenu de l'examen
utiliser pas des symboles ## et symboles **
Titres : # Titre de la section
Gras : **texte en gras**
Italique : _texte en italique_
Souligné : ~texte souligné~
Couleur : ^texte coloré^ `;

}

function convertTextToJson(text) {
    const paragraphs = text.split('\n');
    const sections = [
        {
            "blocks": paragraphs.map(paragraph => {
                const inlines = [];
                let currentText = "";
                let currentFormat = { "fontSize": 12, "fontColor": "#000000" };

                if (paragraph.startsWith('# ') ||paragraph.startsWith('## ')  ) {
                    // Gestion des titres
                    inlines.push({ "text": paragraph.substring(2) + '\n', "characterFormat": { "fontSize": 16, "bold": true, "fontColor": "#000080" } });
                    return { "inlines": inlines };
                }

                for (let i = 0; i < paragraph.length; i++) {
                    const char = paragraph[i];

                    if (char === '*') {
                        if (i + 1 < paragraph.length && paragraph[i + 1] === '*') {
                            // Gestion du gras (**)
                            if (currentText) {
                                inlines.push({ "text": currentText, "characterFormat": currentFormat });
                                currentText = "";
                            }
                            currentFormat = { ...currentFormat, "bold": !currentFormat.bold };
                            i++; // Passer le deuxième *
                        } else {
                            currentText += char; // Simple * sans effet
                        }
                    } else if (char === '_') {
                        if (currentText) {
                            inlines.push({ "text": currentText, "characterFormat": currentFormat });
                            currentText = "";
                        }
                        currentFormat = { ...currentFormat, "italic": !currentFormat.italic };
                    } else if (char === '~') {
                        if (currentText) {
                            inlines.push({ "text": currentText, "characterFormat": currentFormat });
                            currentText = "";
                        }
                        currentFormat = { ...currentFormat, "underline": !currentFormat.underline };
                    } else if (char === '^') {
                        if (currentText) {
                            inlines.push({ "text": currentText, "characterFormat": currentFormat });
                            currentText = "";
                        }
                        const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFA500"];
                        const colorIndex = colors.indexOf(currentFormat.fontColor);
                        currentFormat = { ...currentFormat, "fontColor": colors[(colorIndex + 1) % colors.length] };
                    } else {
                        currentText += char;
                    }
                }

                if (currentText) {
                    inlines.push({ "text": currentText, "characterFormat": currentFormat });
                }

                return { "inlines": inlines };
            })
        }
    ];
    return { "sections": sections };
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
