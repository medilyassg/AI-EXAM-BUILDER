import React, { useState } from 'react';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import Mammoth from "mammoth";
import pdfToText from "react-pdftotext";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Step1 = ({ formData, setFormData, nextStep }) => {
    const [topicText, setTopicText] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState("");

    const handleFileToText = async (file) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            const content = e.target.result;

            if (file.type === "text/plain") {
                setTopicText(content);
            } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                const { value } = await Mammoth.extractRawText({
                    arrayBuffer: content,
                });
                if (value.trim()) {
                    setTopicText(value);
                } else {
                    toast.warn('Le contenu est vide ou le format de fichier peut ne pas être correct.');
                }
            } else if (file.type === "application/pdf") {
                pdfToText(file)
                    .then((extractedText) => {
                        if (extractedText.trim()) {
                            setTopicText(extractedText);
                        } else {
                            toast.warn("Le PDF ne contient pas de texte lisible ou n'a pas pu être traité correctement.");
                        }
                    })
                    .catch((error) => {
                        console.error("Échec de l'extraction de texte du PDF", error);
                        toast.error("Il y a eu un problème lors de l'extraction de texte du PDF. Veuillez essayer un autre fichier.");
                    });
            } else {
                toast.warn("Type de fichier non pris en charge !");
            }
        };

        if (file.type === "text/plain") {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e, setFieldValue) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setFieldValue("topic", file);
            handleFileToText(file);
            setSelectedFileName(file.name);
        }
    };

    const handleSubmit = (values) => {
        if (!values.topic || !topicText.trim()) {
            toast.warn("Veuillez télécharger un fichier.");
            return;
        }
        setFormData((prevData) => ({ ...prevData, ...values, topicText: topicText }));
        nextStep();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
        >
            <h3 className="text-xl font-semibold mb-6 text-cyan-400">Informations de base pour la génération</h3>
            
            <Formik
                initialValues={{
                    subject: formData.subject || '',
                    gradeLevel: formData.gradeLevel || '',
                    topic: formData.topic || null,
                    examType: formData.examType || '',
                    timeLimit: formData.timeLimit || '',
                    language: formData.language || 'fr',
                }}
                onSubmit={handleSubmit}
                validate={(values) => {
                    const errors = {};
                    if (!values.subject) errors.subject = 'La matière est requise';
                    if (!values.gradeLevel) errors.gradeLevel = 'Le niveau scolaire est requis';
                    if (!values.topic) errors.topic = 'Un sujet (fichier) est requis';
                    if (!values.examType) errors.examType = 'Le type d\'évaluation est requis';
                    if (!values.timeLimit) errors.timeLimit = 'La durée est requise';
                    return errors;
                }}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Subject Field */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Matière</label>
                                <Field 
                                    as="select" 
                                    name="subject" 
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                >
                                    <option value="">Sélectionnez une matière</option>
                                    <option value="informatique">Informatique</option>
                                    <option value="mathematique">Mathématiques</option>
                                    <option value="physique">Physique</option>
                                    <option value="histoire">Histoire</option>
                                    <option value="langues">Langues</option>
                                </Field>
                                <ErrorMessage name="subject" component="div" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Grade Level Field */}
                            <div>
                                <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-300 mb-2">Niveau scolaire</label>
                                <Field 
                                    as="select" 
                                    name="gradeLevel" 
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                >
                                    <option value="">Sélectionnez un niveau</option>
                                    <option value="1ere-annee-college">1ère année collège</option>
                                    <option value="2eme-annee-college">2ème année collège</option>
                                    <option value="3eme-annee-college">3ème année collège</option>
                                </Field>
                                <ErrorMessage name="gradeLevel" component="div" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* File Upload Field */}
                            <div className="md:col-span-2">
                                <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">Chapitre/Cours (fichier : WORD, PDF, TXT)
                                <div 
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 bg-gray-700/50'}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, setFieldValue)}
                                >
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <p className="text-gray-400">
                                            {isDragging ? 'Déposez votre fichier ici' : 'Glissez-déposez votre fichier ou cliquez pour sélectionner'}
                                        </p>
                                        <p className="text-xs text-gray-500">Formats supportés: .pdf, .doc, .docx, .txt</p>
                                    </div>
                                    <input
                                        type="file"
                                        id="topic"
                                        name="topic"
                                        accept=".pdf,.doc,.docx,.txt"
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            if (file) {
                                                setFieldValue("topic", file);
                                                handleFileToText(file);
                                                setSelectedFileName(file.name);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </div>
                                </label>
                                {selectedFileName && (
                                    <div className="mt-2 text-sm text-cyan-400">
                                        Fichier sélectionné: {selectedFileName}
                                    </div>
                                )}
                                <ErrorMessage name="topic" component="div" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Exam Type Field */}
                            <div>
                                <label htmlFor="examType" className="block text-sm font-medium text-gray-300 mb-2">Type d'évaluation</label>
                                <Field 
                                    as="select" 
                                    name="examType" 
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                >
                                    <option value="">Sélectionnez un type</option>
                                    <option value="examen">Examen</option>
                                    <option value="devoir">Devoir</option>
                                    <option value="exercice">Exercice</option>
                                    <option value="travaux pratique">Travaux pratique</option>
                                    <option value="travaux dirige">Travaux dirige</option>
                                </Field>
                                <ErrorMessage name="examType" component="div" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Time Limit Field */}
                            <div>
                                <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-300 mb-2">Durée (minutes)</label>
                                <Field 
                                    type="number" 
                                    id="timeLimit" 
                                    name="timeLimit" 
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                    min="5"
                                    max="180"
                                />
                                <ErrorMessage name="timeLimit" component="div" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Language Field */}
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">Langue</label>
                                <Field 
                                    as="select" 
                                    name="language" 
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                >
                                    <option value="fr">Français</option>
                                    <option value="ar">Arabe</option>
                                    <option value="en">Anglais</option>
                                </Field>
                                <ErrorMessage name="language" component="div" className="text-red-400 text-sm mt-1" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end">
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                Suivant
                            </motion.button>
                        </div>
                    </Form>
                )}
            </Formik>
        </motion.div>
    );
};

export default Step1;