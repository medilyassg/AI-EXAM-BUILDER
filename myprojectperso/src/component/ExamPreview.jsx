import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

DocumentEditorContainerComponent.Inject(Toolbar);

const AperçuExamen = () => {
    const [editorKey, setEditorKey] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [examData, setExamData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackInput, setFeedbackInput] = useState({
        quote: "",
        author: "",
        role: ""
    });
    const [actionType, setActionType] = useState("");
    const hostUrl = "https://services.syncfusion.com/react/production/api/documenteditor/";

    // Load exam data and initialize feedback
    useEffect(() => {
        const loadData = () => {
            // Load exam data
            if (location.state?.examData) {
                setExamData(location.state.examData);
                localStorage.setItem('currentExam', JSON.stringify(location.state.examData));
            } else {
                const savedExam = localStorage.getItem('currentExam');
                if (savedExam) {
                    setExamData(JSON.parse(savedExam));
                }
            }

            // Initialize feedback if empty
            const savedFeedback = localStorage.getItem('feedbacks');
            if (!savedFeedback) {
                localStorage.setItem('feedbacks', []);
            }
        };

        loadData();
    }, [location.state]);

    // Initialize editor
    useEffect(() => {
        if (editorRef.current && examData && !isEditorReady) {
            const initializeEditor = async () => {
                try {
                    const editor = editorRef.current.documentEditor;
                    editor.isReadOnly = true;
                    await editor.open(JSON.stringify(examData));
                    editor.documentName = "Examen Généré";

                    if (editor.editor) {
                        editor.editor.enableSpellCheck = false;
                    }

                    setIsEditorReady(true);
                } catch (err) {
                    console.error("Error initializing editor:", err);
                    toast.error("Échec de l'initialisation de l'éditeur");
                }
            };

            initializeEditor();
        }
    }, [examData, isEditorReady]);

    // Handle edit mode changes
    useEffect(() => {
        if (editorRef.current && isEditorReady) {
            const editor = editorRef.current.documentEditor;

            if (isEditing) {
                editor.enableAllModules();
                editor.isReadOnly = false;

                if (examData) {
                    editor.open(JSON.stringify(examData));
                }

                if (editor.editor) {
                    editor.editor.enableSpellCheck = false;
                }
            } else {
                editor.isReadOnly = true;
            }
        }
    }, [isEditing, isEditorReady, examData]);

    const toggleEditMode = () => {
        if (isEditorReady) {
            setIsEditing(prev => {
                const newState = !prev;
                if (newState) {
                    setEditorKey(prevKey => prevKey + 1);
                } else {
                    editorRef.current.documentEditor.open(JSON.stringify(examData));
                }
                return newState;
            });
        }
    };

    const handleSave = () => {
        if (editorRef.current && isEditorReady) {
            const updatedContent = editorRef.current.documentEditor.serialize();
            setExamData(JSON.parse(updatedContent));
            localStorage.setItem('currentExam', updatedContent);
            setIsEditing(false);
            toast.success("Examen sauvegardé avec succès !", {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    const handlePrintOrExport = (type) => {
        setActionType(type);
        if (type === 'print') {
            editorRef.current.documentEditor.print();
            toast.info("Impression en cours...");
            setTimeout(() => setShowFeedbackModal(true), 500);
        } else {
            editorRef.current.documentEditor.save("examen", "Docx");
            toast.info("Export Word en cours...");
            setTimeout(() => setShowFeedbackModal(true), 500);
        }
    };

    const submitFeedback = () => {
        try {
            if (!feedbackInput.quote || !feedbackInput.author) {
                toast.warning("Veuillez remplir les champs obligatoires");
                return;
            }

            // Get existing feedback from local storage
            let existingFeedback = [];
            try {
                const storedFeedback = localStorage.getItem('feedbacks');
                existingFeedback = storedFeedback ? JSON.parse(storedFeedback) : [];
            } catch (err) {
                console.error("Error parsing stored feedback:", err);
                existingFeedback = [];
            }

            // Create new feedback object with timestamp
            const newFeedback = {
                ...feedbackInput,
                actionType: actionType,
                timestamp: new Date().toISOString()
            };

            // Add new feedback to the array
            const updatedFeedback = [...existingFeedback, newFeedback];

            // Save back to local storage
            localStorage.setItem('feedbacks', JSON.stringify(updatedFeedback));

            toast.success("Merci pour votre feedback !");

            // Reset form and close modal
            setShowFeedbackModal(false);
            setFeedbackInput({ quote: "", author: "", role: "" });
        } catch (error) {
            console.error("Error saving feedback:", error);
            toast.error("Une erreur est survenue lors de l'enregistrement du feedback");
        }
    };

    if (!examData) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800"
            >
                <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Aucun examen trouvé</h2>
                    <p className="text-gray-300 mb-6">Veuillez générer un examen pour le visualiser ou le modifier.</p>
                    <motion.button
                        onClick={() => navigate('/examform')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Générer un nouvel examen
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with action buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <motion.h1
                        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isEditing ? 'Modifier Examen' : 'Aperçu Examen'}
                    </motion.h1>

                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.div
                                    key="edit-buttons"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex gap-2"
                                >
                                    <motion.button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2"
                                        disabled={!isEditorReady}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Enregistrer
                                    </motion.button>
                                    <motion.button
                                        onClick={toggleEditMode}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300"
                                        disabled={!isEditorReady}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Annuler
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="view-buttons"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex gap-2"
                                >
                                    <motion.button
                                        onClick={() => handlePrintOrExport('export')}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2"
                                        disabled={!isEditorReady}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Exporter en Word
                                    </motion.button>
                                    <motion.button
                                        onClick={toggleEditMode}
                                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2"
                                        disabled={!isEditorReady}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Modifier l'examen
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handlePrintOrExport('print')}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2"
                                        disabled={!isEditorReady}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Imprimer
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Document Editor Container */}
                <motion.div
                    className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {!isEditorReady && (
                        <div className="flex items-center justify-center h-96">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                            ></motion.div>
                        </div>
                    )}
                    <motion.div
                        key={`editor-${editorKey}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <DocumentEditorContainerComponent
                            ref={editorRef}
                            enableToolbar={isEditing}
                            showPropertiesPane={isEditing}
                            height="100vh"
                            serviceUrl={hostUrl}
                            locale="fr-FR"
                        />
                    </motion.div>
                </motion.div>

                {/* Footer navigation */}
                <motion.div
                    className="mt-8 flex justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Retour a l'accueil
                    </motion.button>
                </motion.div>

                {/* Feedback Modal */}
                <AnimatePresence>
                    {showFeedbackModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/10">
                        <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="w-full max-w-1/2 bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">
                                        {actionType === 'print' ? 'Impression' : 'Export'} - Partagez votre expérience
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Votre témoignage *
                                            </label>
                                            <textarea
                                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                                rows={3}
                                                placeholder="Décrivez votre expérience avec l'outil (ex: Facilité d'utilisation, gain de temps, suggestions d'amélioration...)"
                                                value={feedbackInput.quote}
                                                onChange={(e) => setFeedbackInput({ ...feedbackInput, quote: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                                    Votre nom *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                                    value={feedbackInput.author}
                                                    onChange={(e) => setFeedbackInput({ ...feedbackInput, author: e.target.value })}
                                                    required
                                                    placeholder="Nom et prénom"

                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                                    Votre rôle/fonction
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                                    value={feedbackInput.role}
                                                    placeholder="Fonction et établissement (ex: Enseignant de Physique-Chimie, Lycée Pasteur)"
                                                    onChange={(e) => setFeedbackInput({ ...feedbackInput, role: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-400">
                                        * Ces informations sont conservées localement pour améliorer votre expérience utilisateur. 
                                        Aucune donnée personnelle n'est transmise à des serveurs externes.
                                        </p>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            onClick={() => setShowFeedbackModal(false)}
                                            className="px-4 py-2 text-gray-300 hover:text-white"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={submitFeedback}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                        >
                                            Valider
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    toastClassName="bg-gray-800 text-white"
                    progressClassName="bg-gradient-to-r from-cyan-500 to-blue-500"
                />
            </div>
        </div>
    );
};

export default AperçuExamen;