import React from 'react';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';

const Step2 = ({ formData, setFormData, nextStep, prevStep }) => {
    const handleSubmit = (values) => {
        setFormData((prevData) => ({ ...prevData, ...values }));
        nextStep();
    };

    // Convert questionTypes object to array if needed
    const normalizeQuestionTypes = (questionTypes) => {
        if (Array.isArray(questionTypes)) return questionTypes;
        if (typeof questionTypes === 'object') {
            return Object.keys(questionTypes).filter(key => questionTypes[key]);
        }
        return [];
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Progress Header */}
          

            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Paramètres des questions</h3>

            <Formik
                initialValues={{
                    totalQuestions: formData.totalQuestions || "",  // Ensure it's empty if undefined
        questionTypes: normalizeQuestionTypes(formData.questionTypes) || [], 
        difficulty: formData.difficulty || "", // Ensure empty if undefined
        keywords: formData.keywords || "",
                }}
                onSubmit={handleSubmit}
                validate={(values) => {
                    const errors = {};
                    
                    // Total Questions Validation
                    if (!values.totalQuestions) {
                        errors.totalQuestions = 'Ce champ est obligatoire';
                    } else if (values.totalQuestions < 1) {
                        errors.totalQuestions = 'Minimum 1 question';
                    } else if (values.totalQuestions > 50) {
                        errors.totalQuestions = 'Maximum 50 questions';
                    }

                    // Question Types Validation
                    if (!values.questionTypes || values.questionTypes.length === 0) {
                        errors.questionTypes = 'Sélectionnez au moins un type de question';
                    }

                    // Difficulty Validation
                    if (!values.difficulty) {
                        errors.difficulty = 'Sélectionnez un niveau de difficulté';
                    }

                    return errors;
                }}
            >
                {({ errors, touched, values, setFieldValue }) => {
                    // Handle checkbox changes for object format
                    const handleCheckboxChange = (type, isChecked) => {
                        const currentTypes = Array.isArray(values.questionTypes) 
                            ? [...values.questionTypes]
                            : [];
                        
                        if (isChecked) {
                            if (!currentTypes.includes(type)) {
                                currentTypes.push(type);
                            }
                        } else {
                            const index = currentTypes.indexOf(type);
                            if (index > -1) {
                                currentTypes.splice(index, 1);
                            }
                        }
                        setFieldValue('questionTypes', currentTypes);
                    };

                    return (
                        <Form className="space-y-6">
                            {/* Total Questions Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre total de questions
                                </label>
                                <Field 
                                    type="number" 
                                    name="totalQuestions" 
                                    min="1"
                                    max="50"
                                    className={`w-full bg-gray-700 border ${
                                        errors.totalQuestions && touched.totalQuestions 
                                            ? 'border-red-500' 
                                            : 'border-gray-600'
                                    } rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
                                />
                                <ErrorMessage name="totalQuestions">
                                    {msg => <div className="text-red-400 text-sm mt-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {msg}
                                    </div>}
                                </ErrorMessage>
                            </div>

                            {/* Difficulty Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Niveau de difficulté
                                </label>
                                <Field
                                    as="select"
                                    name="difficulty"
                                    className={`w-full bg-gray-700 border ${
                                        errors.difficulty && touched.difficulty 
                                            ? 'border-red-500' 
                                            : 'border-gray-600'
                                    } rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
                                >
                                    <option value="">Sélectionnez...</option>
                                    <option value="easy">Facile</option>
                                    <option value="medium">Moyen</option>
                                    <option value="hard">Difficile</option>
                                    <option value="mixed">Mixte</option>
                                </Field>
                                <ErrorMessage name="difficulty">
                                    {msg => <div className="text-red-400 text-sm mt-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {msg}
                                    </div>}
                                </ErrorMessage>
                            </div>

                            {/* Question Types Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Types de questions
                                </label>
                                <div 
                                    className={`p-4 rounded-lg border ${
                                        errors.questionTypes && touched.questionTypes 
                                            ? 'border-red-500 bg-red-900/20' 
                                            : 'border-gray-600 bg-gray-700/50'
                                    }`}
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {[
                                            { value: 'MCQ', label: 'Choix multiples' },
                                            { value: 'TrueFalse', label: 'Vrai/Faux' },
                                            { value: 'ShortAnswer', label: 'Réponse courte' },
                                            { value: 'Essay', label: 'Essai' },
                                            { value: 'ProblemSolving', label: 'Problèmes' }
                                        ].map((type) => {
                                            const isChecked = values.questionTypes.includes(type.value);
                                            return (
                                                <label key={type.value} className="flex items-center space-x-2">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isChecked}
                                                        onChange={(e) => handleCheckboxChange(type.value, e.target.checked)}
                                                        className="h-4 w-4 text-cyan-500 border-gray-600 rounded focus:ring-cyan-500 bg-gray-700"
                                                    />
                                                    <span className="text-gray-300 text-sm">{type.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                                <ErrorMessage name="questionTypes">
                                    {msg => <div className="text-red-400 text-sm mt-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {msg}
                                    </div>}
                                </ErrorMessage>
                            </div>

                            {/* Keywords Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Mots-clés/Concepts clés (optionnel)
                                </label>
                                <Field
                                    type="text"
                                    name="keywords"
                                    placeholder="Ex: algèbre, géométrie, trigonométrie"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Ces mots-clés aideront à orienter la génération des questions
                                </p>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6">
                                <motion.button
                                    type="button"
                                    onClick={prevStep}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg shadow-md transition-all"
                                >
                                    Précédent
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                                >
                                    Suivant 
                                </motion.button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </motion.div>
    );
};

export default Step2;