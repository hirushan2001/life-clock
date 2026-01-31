import { motion } from 'framer-motion';
import { Hourglass } from 'lucide-react';

const SplashScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        >
            <div className="relative">
                <motion.div
                    animate={{
                        rotate: 360,
                        transition: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                    className="relative z-10 p-4 rounded-2xl bg-primary/10 text-primary"
                >
                    <Hourglass className="w-12 h-12" />
                </motion.div>

                {/* Pulse effect */}
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
            >
                <h1 className="text-2xl font-bold font-serif tracking-tight text-foreground">
                    Memento
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Life Clock
                </p>
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;
