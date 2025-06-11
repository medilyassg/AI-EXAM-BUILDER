import React, { useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const HomePage = () => {
    // Animation controls for each section
    const [ref1, inView1] = useInView({ threshold: 0.1, triggerOnce: true });
    const [ref2, inView2] = useInView({ threshold: 0.1, triggerOnce: true });
    const [ref3, inView3] = useInView({ threshold: 0.1, triggerOnce: true });
    const [ref4, inView4] = useInView({ threshold: 0.1, triggerOnce: true });
    const [ref5, inView5] = useInView({ threshold: 0.1, triggerOnce: true });

    const controls1 = useAnimation();
    const controls2 = useAnimation();
    const controls3 = useAnimation();
    const controls4 = useAnimation();
    const controls5 = useAnimation();

    useEffect(() => {
        if (inView1) controls1.start("visible");
        if (inView2) controls2.start("visible");
        if (inView3) controls3.start("visible");
        if (inView4) controls4.start("visible");
        if (inView5) controls5.start("visible");
    }, [inView1, inView2, inView3, inView4, inView5]);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9]
            }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.
            }
        }
    };

    const staggerItem = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.2, 0.65, 0.3, 0.9]
            }
        }
    };

    const cardHover = {
        hover: {
            y: -10,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };
// Add this useEffect to listen for storage changes
useEffect(() => {
    const handleStorageChange = () => {
      const savedFeedbacks = localStorage.getItem('feedbacks');
      if (savedFeedbacks) {
        setTestimonials(JSON.parse(savedFeedbacks));
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

    // Replace the static testimonials array with this:
const [testimonials, setTestimonials] = React.useState(() => {
    // Load from local storage or use default if none exists
    const savedFeedbacks = localStorage.getItem('feedbacks');
    return savedFeedbacks ? JSON.parse(savedFeedbacks) : [
      {
        quote: "ExamenFutur  m'a fait gagner un temps précieux dans la préparation de mes évaluations. Un outil indispensable pour tout enseignant moderne!",
        author: "Prof. Sophie Martin",
        role: "Enseignante de Mathématiques, Lycée Descartes"
      },
      {
        quote: "La qualité des examens générés est exceptionnelle. Je peux maintenant créer des évaluations différenciées pour mes élèves en quelques minutes.",
        author: "Dr. Jean Lefèvre",
        role: "Formateur en Sciences, Université de Paris"
      }
    ];
  });

    const [activeTestimonial, setActiveTestimonial] = React.useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Features data
    const features = [
        {
            icon: "📝",
            title: "Génération Automatique",
            description: "Créez des examens complets en spécifiant simplement la matière et le niveau scolaire"
        },
        {
            icon: "🎓",
            title: "Adaptation Pédagogique",
            description: "Questions adaptées aux programmes scolaires et compétences ciblées"
        },
        {
            icon: "⏱️",
            title: "Gain de Temps",
            description: "Réduisez considérablement le temps de préparation de vos évaluations"
        },
        {
            icon: "🖨️",
            title: "Export Facile",
            description: "Téléchargez vos examens au format Word ou PDF, prêts à imprimer"
        }
    ];

    return (
        <div className="font-sans text-gray-200 antialiased bg-gray-900">
            {/* Hero Section */}
            <header className="relative bg-gradient-to-br from-indigo-900 to-purple-900 text-white overflow-hidden pb-30">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 z-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                </div>
                
                <div className="container mx-auto px-6 py-32 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                Créez des Examens Parfaits
                            </span>
                        </h1>
                        <h2 className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto">
                            L'outil intelligent qui révolutionne la création d'évaluations pour les enseignants modernes
                        </h2>
                        <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
>
    <Link
        to="/examform"
        className="inline-block px-8 py-4 bg-cyan-500 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-cyan-400 transition-colors text-lg"
    >
        Commencer Maintenant
    </Link>
</motion.div>


                    </motion.div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </header>


            {/* Features Section */}
            <motion.section 
                ref={ref2}
                initial="hidden"
                animate={controls2}
                variants={staggerContainer}
                id="features"
                className="py-20  bg-gray-800 "
            >
                <div className="container mx-auto px-6">
                    <motion.div variants={staggerItem} className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Une Solution Complète pour les Enseignants</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            ExamenFutur  combine puissance technologique et simplicité d'utilisation pour votre flux de travail pédagogique
                        </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div 
                                key={index}
                                variants={staggerItem}
                                className="bg-gray-700 p-8 rounded-xl shadow-sm  hover:shadow-lg transition-all border border-gray-600"
                            >
                                <div className="text-4xl mb-4 text-cyan-400">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* How It Works */}
            <motion.section 
                ref={ref3}
                initial="hidden"
                animate={controls3}
                variants={staggerContainer}
                className="py-20 bg-gray-900"
            >
                <div className="container mx-auto px-6">
                    <motion.div variants={staggerItem} className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Fonctionnement en 3 Étapes Simples</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Créez votre premier examen en moins de 5 minutes
                        </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div 
                            variants={staggerItem}
                            className="relative"
                        >
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">1</div>
                            <div className="bg-gray-800 p-8 pt-12 rounded-xl h-full border border-gray-700">
                                <h3 className="text-xl font-semibold mb-3 text-white">Configuration</h3>
                                <p className="text-gray-300">
                                    Spécifiez la matière, le niveau et les compétences à évaluer.
                                </p>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            variants={staggerItem}
                            className="relative"
                        >
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">2</div>
                            <div className="bg-gray-800 p-8 pt-12 rounded-xl h-full border border-gray-700">
                                <h3 className="text-xl font-semibold mb-3 text-white">Génération</h3>
                                <p className="text-gray-300">
                                    Notre IA crée automatiquement l'examen adapté.
                                </p>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            variants={staggerItem}
                            className="relative"
                        >
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">3</div>
                            <div className="bg-gray-800 p-8 pt-12 rounded-xl h-full border border-gray-700">
                                <h3 className="text-xl font-semibold mb-3 text-white">Export</h3>
                                <p className="text-gray-300">
                                    Téléchargez au format Word ou PDF.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

{/* Testimonials */}
<motion.section 
    ref={ref4}
    initial="hidden"
    animate={controls4}
    variants={staggerContainer}
    className="py-20 bg-gray-800"
>
    <div className="container mx-auto px-6">
        <motion.div variants={staggerItem} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Témoignages</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Ce que nos utilisateurs disent de ExamenFutur 
            </p>
        </motion.div>
        
        {testimonials.length > 0 ? (
            <>
                <div className="max-w-4xl mx-auto relative h-64">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTestimonial}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gray-700 p-8 rounded-xl shadow-sm absolute inset-0 flex flex-col justify-center"
                        >
                            <blockquote className="text-xl italic text-gray-200 mb-6">
                                "{testimonials[activeTestimonial].quote}"
                            </blockquote>
                            <div className="text-right">
                                <p className="font-semibold text-white">{testimonials[activeTestimonial].author}</p>
                                {testimonials[activeTestimonial].role && (
                                    <p className="text-gray-400">{testimonials[activeTestimonial].role}</p>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                {testimonials.length > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTestimonial(index)}
                                className={`w-3 h-3 rounded-full ${activeTestimonial === index ? 'bg-cyan-400' : 'bg-gray-500'}`}
                                aria-label={`Afficher le témoignage ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </>
        ) : (
            <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                    Soyez le premier à partager votre expérience avec ExamenFutur !
                </p>
            </div>
        )}
    </div>
</motion.section>

            {/* CTA */}
            <motion.section 
                ref={ref5}
                initial="hidden"
                animate={controls5}
                variants={fadeInUp}
                className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white"
            >
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Prêt à Transformer Votre Enseignement?</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
                        Rejoignez la communauté d'enseignants innovants qui utilisent ExamenFutur  pour gagner du temps et améliorer leurs évaluations.
                    </p>
                    <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
>
    <Link
        to="/examform"
        className="inline-block px-8 py-4 bg-cyan-500 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-cyan-400 transition-colors text-lg"
    >
        Commencer Maintenant
    </Link>
</motion.div>

                </div>
            </motion.section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">ExamenFutur </h3>
                            <p className="mb-4">L'outil ultime pour les enseignants modernes</p>
                            <p>Projet encadré par Mme NAJOUA HRICH</p>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Étudiant</h3>
                            <p className="mb-2">EL GHAZI MOHAMED ILYASS</p>
                            <p>Spécialité Informatique</p>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Institution</h3>
                            <p className="mb-2">CRMEF Tanger</p>
                            <p>Année 2024/2025</p>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
                            <p>crmef.tanger@education.ma</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                        <p>© 2024 ExamenFutur . Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;