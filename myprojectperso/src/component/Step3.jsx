import React from 'react';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Step3 = ({ formData, setFormData, prevStep, onSubmit }) => {
    const handleSubmit = (values) => {
        const completeFormData = { ...formData, ...values };
        setFormData(completeFormData);
        onSubmit(completeFormData);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
           

            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Informations Supplémentaires</h3>

            <Formik
                initialValues={{
                    objectifsPedagogiques: formData.objectifsPedagogiques || '',
                    contraintesSpecifiques: formData.contraintesSpecifiques || '',
                    exemplesQuestions: formData.exemplesQuestions || '',
                }}
                onSubmit={handleSubmit}
                validate={(values) => {
                    const errors = {};
                    // Add validation rules if needed
                    return errors;
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        {/* Objectifs Pédagogiques */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Objectifs Pédagogiques
                            </label>
                            <Field 
                                as="textarea"
                                name="objectifsPedagogiques"
                                rows={3}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder="Décrivez les objectifs d'apprentissage que cet examen doit évaluer..."
                            />
                            <ErrorMessage name="objectifsPedagogiques">
                                {msg => <div className="text-red-400 text-sm mt-1 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {msg}
                                </div>}
                            </ErrorMessage>
                        </div>

                        {/* Contraintes Spécifiques */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Contraintes Spécifiques
                            </label>
                            <Field 
                                as="textarea"
                                name="contraintesSpecifiques"
                                rows={3}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder="Indiquez toutes contraintes particulières (temps, format, outils autorisés...)"
                            />
                            <ErrorMessage name="contraintesSpecifiques">
                                {msg => <div className="text-red-400 text-sm mt-1 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {msg}
                                </div>}
                            </ErrorMessage>
                        </div>

                        {/* Exemples de Questions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Exemples de Questions (optionnel)
                            </label>
                            <Field 
                                as="textarea"
                                name="exemplesQuestions"
                                rows={3}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder="Ajoutez des exemples de questions que vous souhaiteriez voir incluses..."
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Ces exemples aideront à orienter le style des questions générées
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
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Génération en cours...
                                    </span>
                                ) : (
                                    'Générer l\'examen'
                                )}
                            </motion.button>
                        </div>
                    </Form>
                )}
            </Formik>
        </motion.div>
    );
};

export default Step3;