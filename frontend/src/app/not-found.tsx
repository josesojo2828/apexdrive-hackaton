import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
                <h2 className="text-4xl font-black mb-4 text-slate-900 dark:text-white">404</h2>
                <p className="mb-6 text-slate-600 dark:text-slate-400">Página no encontrada</p>
                <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
}
