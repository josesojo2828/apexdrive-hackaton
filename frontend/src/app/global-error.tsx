"use client";


export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="es">
            <body>
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
                        <h2 className="text-4xl font-black mb-4 text-slate-900 dark:text-white">Algo salió mal</h2>
                        <p className="mb-6 text-slate-600 dark:text-slate-400">
                            Ocurrió un error inesperado. {error.message}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => reset()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                            >
                                Intentar de nuevo
                            </button>

                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a href="/" className="px-6 py-3 bg-slate-600 text-white rounded-xl font-bold hover:bg-slate-700 transition">
                                Volver al Inicio
                            </a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}
