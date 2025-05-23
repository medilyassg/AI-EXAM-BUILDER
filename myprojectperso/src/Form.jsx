import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Step1 from './component/Step1';
import Step2 from './component/Step2';
import Step3 from './component/Step3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

function ExamGenerationForm() {
    const [formData, setFormData] = useState({
        subject: '',
        gradeLevel: '',
        topic: null,
        topicText: '',
        examType: '',
        timeLimit: '',
        language: 'fr',
        questionsCount: 10,
        difficulty: '',
        questionTypes:[]
    });
    
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);
    const navigate = useNavigate();

    // Auto-save form data to localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('examFormData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('examFormData', JSON.stringify(formData));
    }, [formData]);

    const nextStep = () => {
        setDirection(1);
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setDirection(-1);
        setCurrentStep(currentStep - 1);
    };

    const simulateProgress = () => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 10;
            if (currentProgress >= 90) {
                clearInterval(interval);
            }
            setProgress(Math.min(currentProgress, 90));
        }, 300);
        return interval;
    };

    const submitForm = async (finalData) => {
        setIsSubmitting(true);
        setShowFullScreenLoader(true);
        const progressInterval = simulateProgress();

        try {
            const response = await fetch('https://ai-exam-builder.vercel.app/generate-exam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    formData: {
                        ...finalData,
                        generationDate: new Date().toISOString(),
                        version: '1.0.0'
                    } 
                }),
            });

            clearInterval(progressInterval);
            setProgress(100);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.examJson) {
                toast.success('Examen généré avec succès!');
                setTimeout(() => {
                    navigate('/exam-preview', { state: { examData: result.examJson } });
                }, 1500);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(`Erreur lors de la génération: ${error.message}`);
            setIsSubmitting(false);
            setProgress(0);
            setShowFullScreenLoader(false);
            clearInterval(progressInterval);
        }
    };

    const stepVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        exit: (direction) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            transition: {
                duration: 0.2
            }
        })
    };

    return (
        <div className="font-sans text-gray-200 antialiased bg-gray-900 min-h-screen flex flex-col">
            {/* Full-screen loader */}
            <AnimatePresence>
                {showFullScreenLoader && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="mb-8"
                        >
                            <svg className="w-24 h-24 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </motion.div>
                        
                        <h2 className="text-3xl font-bold text-cyan-400 mb-4">Génération de l'examen en cours</h2>
                        <p className="text-gray-400 mb-8">Veuillez patienter pendant que nous créons votre examen...</p>
                        
                        <div className="w-full max-w-md px-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-cyan-400">Progression</span>
                                <span className="text-sm font-medium text-cyan-400">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <motion.div 
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Header */}
            <header className="bg-gray-800 py-4 border-b border-gray-700">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                        AI Exam Builder
                    </Link>
                    <nav>
                        <ul className="flex space-x-6">
                            <li>
                                <Link to="/" className="hover:text-cyan-400 transition-colors">Accueil</Link>
                            </li>
                            <li>
                                <Link to="/examform" className="text-cyan-400 font-medium">Créer un Examen</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto h-full flex flex-col">
                    {/* Progress Bar */}
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className={`flex flex-col items-center ${currentStep >= step ? 'text-cyan-400' : 'text-gray-500'}`}>
                                    <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-400'} font-semibold transition-colors duration-300`}
                                    >
                                        {step}
                                    </motion.div>
                                    <span className="text-xs sm:text-sm mt-2 font-medium">
                                        {step === 1 && 'Configuration'}
                                        {step === 2 && 'Contenu'}
                                        {step === 3 && 'Validation'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentStep / 3) * 100}%` }}
                                transition={{ duration: 0.5, type: "spring" }}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full"
                            />
                        </div>
                    </motion.div>

                    {/* Form Container */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 flex-1 flex flex-col"
                    >
                        <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col">
                            <motion.h2 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6"
                            >
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                    Création Automatisée d'Examen
                                </span>
                            </motion.h2>
                            
                            <div className="flex-1 relative min-h-[650px]">
                                <AnimatePresence custom={direction} mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        custom={direction}
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute inset-0 p-2 sm:p-4 "
                                    >
                                        {currentStep === 1 && (
                                            <Step1 
                                                formData={formData} 
                                                setFormData={setFormData} 
                                                nextStep={nextStep} 
                                            />
                                        )}
                                        {currentStep === 2 && (
                                            <Step2 
                                                formData={formData} 
                                                setFormData={setFormData} 
                                                nextStep={nextStep} 
                                                prevStep={prevStep} 
                                            />
                                        )}
                                        {currentStep === 3 && (
                                            <Step3 
                                                formData={formData} 
                                                setFormData={setFormData} 
                                                prevStep={prevStep} 
                                                onSubmit={submitForm} 
                                                isSubmitting={isSubmitting}
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastClassName="bg-gray-700 text-gray-200 shadow-lg border border-gray-600"
                progressClassName="bg-gradient-to-r from-cyan-500 to-blue-500"
            />

            <footer className="bg-gray-800 text-gray-400 py-4 border-t border-gray-700">
                <div className="container mx-auto px-6 text-center text-sm">
                    <p>© {new Date().getFullYear()} AI Exam Builder. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}

export default ExamGenerationForm;
