import { Link, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface WelcomeProps {
    canLogin: boolean;
    canRegister: boolean;
    laravelVersion: string;
    phpVersion: string;
}

export default function Welcome({ canLogin, canRegister, laravelVersion, phpVersion }: WelcomeProps) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
                <div className="absolute top-0 right-0 p-6 text-right">
                    {canLogin ? (
                        <div className="flex gap-4 items-center">
                            <Link
                                href={route('login')}
                                className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
                            >
                                Log in
                            </Link>

                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Register
                                </Link>
                            )}
                        </div>
                    ) : (
                        <Link
                            href={route('dashboard')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2">
                            <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-6">
                                Plant Disease Detection
                            </h1>
                            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                                Identify plant diseases instantly with our AI-powered detection system. 
                                Upload a photo of your plant's leaves and get accurate diagnosis and treatment recommendations.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                            <path d="m9 12 2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Instant Detection</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Get results in seconds with our advanced AI model</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                            <path d="m9 12 2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Treatment Suggestions</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Get expert recommendations on how to treat identified diseases</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                            <path d="m9 12 2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">History Tracking</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Keep track of all your plant scans and monitor health over time</p>
                                    </div>
                                </div>
                            </div>
                            
                            {canRegister && (
                                <div className="mt-8">
                                    <Link href={route('register')}>
                                        <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                        
                        <div className="md:w-1/2">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-25"></div>
                                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl overflow-hidden">
                                    <img 
                                        src="/images/plant-detection-demo.jpg" 
                                        alt="Plant Disease Detection Demo" 
                                        className="rounded-lg w-full h-auto"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/600x400?text=Plant+Disease+Detection';
                                        }}
                                    />
                                    <div className="mt-4 p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">How it works</h3>
                                        <ol className="mt-2 ml-4 list-decimal text-gray-600 dark:text-gray-400">
                                            <li>Upload or take a photo of your plant</li>
                                            <li>Our AI analyzes the image</li>
                                            <li>Get detailed results and treatment options</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} Plant Disease Detection App
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
                            Powered by Laravel v{laravelVersion} (PHP v{phpVersion})
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
} 